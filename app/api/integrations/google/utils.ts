import { prisma } from '@/src/utils/prisma';

export async function getValidGoogleToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.googleAccessToken) {
    return null;
  }

  // Check if token is expired (with 1 min buffer)
  if (user.googleTokenExpiry && new Date(Date.now() + 60000) < user.googleTokenExpiry) {
    return user.googleAccessToken;
  }

  // Token is expired, try to refresh
  if (!user.googleRefreshToken) {
    return null;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: user.googleRefreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: data.access_token,
        googleTokenExpiry: new Date(Date.now() + data.expires_in * 1000),
      },
    });

    return data.access_token;
  } catch (err) {
    console.error('Refresh token error:', err);
    return null;
  }
}

export async function createGoogleSheet(accessToken: string, title: string, data: any[][]) {
  try {
    // 1. Create a new spreadsheet
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { title },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.error?.message || 'Failed to create spreadsheet');
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // 2. Write data to the spreadsheet
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: data,
      }),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(error.error?.message || 'Failed to populate spreadsheet');
    }

    return { url: spreadsheet.spreadsheetUrl, spreadsheetId };
  } catch (err: any) {
    console.error('Create sheet error:', err);
    throw err;
  }
}

export async function formatGoogleSheet(accessToken: string, spreadsheetId: string, data: any[][], individualOrderStartIndex: number, individualOrderCount: number) {
  try {
    const requests: any[] = [];

    // Colors for individual orders
    const colors = [
      { red: 1, green: 0.78, blue: 0.81 }, // Light Red (FFC7CE approx)
      { red: 1, green: 0.92, blue: 0.61 }, // Light Yellow (FFEB9C approx)
      { red: 0.78, green: 0.94, blue: 0.81 }, // Light Green (C6EFCE approx)
      { red: 0.74, green: 0.84, blue: 0.93 }, // Light Blue (BDD7EE approx)
      { red: 0.85, green: 0.85, blue: 0.85 }, // Light Grey (D9D9D9 approx)
    ];

    // Format individual orders
    let currentRow = individualOrderStartIndex;
    for (let i = 0; i < individualOrderCount; i++) {
      const color = colors[i % colors.length];

      // Each individual order has 6 rows (header + 5 fields) + 1 empty row
      const startRow = currentRow;
      const endRow = currentRow + 6;

      requests.push({
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: startRow,
            endRowIndex: endRow,
            startColumnIndex: 2,
            endColumnIndex: 10
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: color,
            }
          },
          fields: 'userEnteredFormat.backgroundColor'
        }
      });

      currentRow += 7; // Skip to next block
    }

    // Bold headers
    requests.push({
      repeatCell: {
        range: {
          sheetId: 0,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 1
        },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true, fontSize: 14 }
          }
        },
        fields: 'userEnteredFormat.textFormat'
      }
    });

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

  } catch (err) {
    console.error('Format sheet error:', err);
  }
}
