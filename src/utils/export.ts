export function prepareExportData(order: any) {
    const orderData = order.data as any;
    const guestItems = orderData?.individual_orders || [];
    const mainInfo = orderData?.main_order_information || {};

    // Prepare structured data for hierarchical export
    const mainInfoRows = [
        ['Main Order Information'],
        ['Business Client', mainInfo.business_client || ''],
        ['Client Name', mainInfo.client_name || ''],
        ['Client Information', mainInfo.client_information || ''],
        ['Order Subtotal', mainInfo.order_subtotal ? `$${mainInfo.order_subtotal}` : ''],
        ['Requested Pickup Time', mainInfo.requested_pick_up_time || ''],
        ['Requested Pickup Date', mainInfo.requested_pick_up_date || ''],
        ['Number of Guests', mainInfo.number_of_guests || ''],
        ['Delivery', mainInfo.delivery || ''],
        [], // Empty row
    ];

    const groupOrders = orderData?.group_orders || [];
    const groupOrderRows = groupOrders.length > 0 ? [
        ['', 'Group Order'],
        ['', 'Group Order Number #', groupOrders[0].group_order_number || ''],
        ['', 'Group Order # - Pick Time', groupOrders[0].pick_time || ''],
        [], // Empty row
    ] : [];

    const individualOrderRows: any[][] = [];
    guestItems.forEach((item: any, index: number) => {
        const modifications = Array.isArray(item.modifications) ? item.modifications : [];
        individualOrderRows.push(['', '', `Individual Order ${index + 1}`]);
        individualOrderRows.push(['', '', 'Group Order Number #', item.group_order_number || '']);
        individualOrderRows.push(['', '', 'Guest Name', item.guest_name || '']);
        individualOrderRows.push(['', '', 'Item Name', item.item_name || '']);
        individualOrderRows.push(['', '', 'Modifications', ...modifications]);
        individualOrderRows.push(['', '', 'Comments', item.comments || '']);
        individualOrderRows.push([]); // Empty row between individuals
    });

    return [
        ...mainInfoRows,
        ...groupOrderRows,
        ...individualOrderRows
    ];
}
