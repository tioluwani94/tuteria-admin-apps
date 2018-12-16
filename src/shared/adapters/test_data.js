export function testData() {
  return [
    {
      amount: "N20,000",
      email: "james@example.com",
      date: "2018-10-12 14:10:33",
      order: "1002",
      account_no: "00032423222",
      bank: "GT Bank",
      account_name: "Shola Ameobi",
      phone_no: "07033233322",
      wallet_amount: "N0"
    },
    {
      amount: "N10,000",
      email: "gbozee@example.com",
      date: "2018-10-11 12:30:33",
      order: "1003",
      account_no: "00032423222",
      bank: "GT Bank",
      account_name: "Shola Ameobi",
      phone_no: "07033233322",
      wallet_amount: "N0"
    },
    {
      amount: "N10,000",
      email: "gbozee@example.com",
      date: "2018-10-12 9:20:33",
      order: "1001",
      account_no: "00032423222",
      bank: "GT Bank",
      account_name: "Shola Ameobi",
      phone_no: "07033233322",
      wallet_amount: "N0"
    },
    {
      amount: "N10,000",
      email: "gbozee@example.com",
      date: "2018-10-10 9:20:33",
      order: "1004",
      account_no: "00032423222",
      bank: "GT Bank",
      account_name: "Shola Ameobi",
      phone_no: "07033233322",
      wallet_amount: "N0"
    },
    {
      amount: "N10,500",
      email: "shola@example.com",
      date: "2018-10-10 9:20:33",
      order: "1005",
      account_no: "00032423222",
      bank: "GT Bank",
      account_name: "Shola Ameobi",
      phone_no: "07033233322",
      wallet_amount: "N0"
    }
  ];
}
export function testDataTransactions() {
  return [
    {
      amount: "N2000",
      status: "EARNING",
      date: "2018-10-10 9:20:33",
      order: "AA101",
      client_email: "james@example.com",
      tutor_email: "Shola@example.com",
      booking: {
        order: "BookinOrder",
        status: "COMPLETED",
        start_time: "2018-10-10 9:20:33",
        end_time: "2018-11-10 9:20:33"
      },
      made_payment: true
    },
    {
      amount: "N2000",
      status: "WITHDRAWAL",
      date: "2018-10-10 9:20:33",
      order: "AA102",
      client_email: "james@example.com",
      tutor_email: "Shola@example.com",
      booking: {
        order: "BookinOrder",
        status: "COMPLETED",
        start_time: "2018-10-10 9:20:33",
        end_time: "2018-11-10 9:20:33"
      },
      made_payment: true
    },
    {
      amount: "N12,000",
      status: "EARNING",
      date: "2018-10-10 9:20:33",
      order: "AA103",
      client_email: "james@example.com",
      tutor_email: "Shola@example.com",
      booking: {
        order: "BookinOrder",
        status: "COMPLETED",
        start_time: "2018-10-10 9:20:33",
        end_time: "2018-11-10 9:20:33"
      },
      made_payment: true
    },
    {
      amount: "N2000",
      status: "WITHDRAWAL",
      date: "2018-10-10 9:20:33",
      order: "AA104"
    },
    {
      amount: "N2000",
      status: "BANK_CHARGE",
      date: "2018-10-10 9:20:33",
      order: "AA105"
    }
  ];
}

export const hiredData = [
  {
    order: "RSET323",
    name: "Jamie Novak",
    email: "jamie@example.com",
    amount: "N20,000",
    date: "2018-10-12 14:10:33"
  },
  {
    order: "GED482BCOO132",
    name: "Shola James",
    email: "shola@example.com",
    amount: "N30,000",
    date: "2018-9-12 14:10:33"
  },
  {
    order: "GED482BCOO134",
    name: "Shola James",
    email: "shola@example.com",
    amount: "N30,000",
    date: "2018-9-12 14:10:33"
  },
  {
    order: "GED482BCOO135",
    name: "Shola James",
    email: "shola@example.com",
    amount: "N30,000",
    date: "2018-9-12 14:10:33"
  },
  {
    order: "GED482BCOO136",
    name: "Shola James",
    email: "shola@example.com",
    amount: "N30,000",
    date: "2018-9-12 14:10:33"
  },
  {
    order: "GED482BCCDD",
    name: "Tope Oluwa",
    email: "tope@example.com",
    amount: "N40,000",
    date: "2018-10-12 14:10:33"
  },
  {
    order: "BBCCDD231",
    name: "Kenny Kalak",
    email: "kenny@example.com",
    amount: "N20,500",
    date: "2018-9-12 14:10:33"
  },
  {
    order: "AAD10211",
    name: "Biola Ojodu",
    email: "biola@example.com",
    amount: "N50,000",
    date: "2018-7-12 14:10:33"
  },
  {
    order: "AABBCCDD101",
    name: "Godwin Alogi",
    email: "godwin@example.com",
    amount: "N22,000",
    date: "2018-10-12 14:10:33"
  },
  {
    order: "OPDES323",
    name: "Dotun 101",
    email: "dotsman@example.com",
    amount: "N22,000",
    date: "2018-10-12 14:10:33"
  },
  {
    order: "YAB324D",
    name: "Peace Pastor",
    email: "peace@example.com",
    amount: "N22,000",
    date: "2018-10-12 14:10:33"
  },
  {
    order: "XYDE323",
    name: "Shope Alogi",
    email: "shopses@example.com",
    amount: "N22,000",
    date: "2018-10-12 14:10:33"
  }
];

export const VerifiedTransactions = {
  "12/03/2018": [
    {
      method: "Paystack",
      order: "AABBCCDD101",
      amount: "20000"
    },

    {
      method: "UBA Bank",
      order: "AAD10211",
      amount: "20000"
    },
    {
      method: "GT Bank",
      order: "BBCCDD231",
      amount: "20000"
    },
    {
      method: "Zenith Bank",
      order: "GED482BCCDD",
      amount: "20000"
    }
  ],
  "13/05/2018": [
    {
      method: "Paystack",
      order: "XYDE323",
      amount: "20000"
    },

    {
      method: "UBA Bank",
      order: "YAB324D",
      amount: "20000"
    },
    {
      method: "GT Bank",
      order: "OPDES323",
      amount: "20000"
    },
    {
      method: "Zenith Bank",
      order: "RSET323",
      amount: "20000"
    }
  ]
};
