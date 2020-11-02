let ord = await DataStore.save(
  new db.Order({
    consumerId: '123',
    supplierId: '1234',
    consumerIdERP: '1508141324',
    date: XSalesConsumer.getDateFormatter(new Date()),
    deliveryExpectedOn: XSalesConsumer.getDateFormatter(new Date()),
    deliveryOn: XSalesConsumer.getDateFormatter(new Date()),
    discountAmount: 0,
    grossAmount: 0,
    netAmount: 0,
    orderComments: '',
    requestComment: '',
    orderCode: '123',
    shipping: db.ShippingType.DELIVERY,
    status: db.OrderStatus.CREATING,
    taxAmount: 0,
  })
);

let op1 = await DataStore.save(
  new db.OrderProduct({
    orderId: ord.id,
    productId: '1405',
    unitId: 'CA',
    discountAmount: 0,
    grossAmount: 0,
    netAmount: 0,
    price: 14,
    quantity: 2,
    taxAmount: 1,
  })
);

let op2 = await DataStore.save(
  new db.OrderProduct({
    orderId: ord.id,
    productId: '1405',
    unitId: 'CJ',
    discountAmount: 0,
    grossAmount: 0,
    netAmount: 0,
    price: 14,
    quantity: 1,
    taxAmount: 2,
  })
);

return await DataStore.save(
  db.Order.copyOf(ord, (updated) => {
    updated.status = db.OrderStatus.DRAFT;
  })
);
