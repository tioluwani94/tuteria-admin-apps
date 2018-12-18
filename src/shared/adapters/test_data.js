import logo from "./logo.svg";
import { workingActions as actions } from "../contexts/tutor_success";
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

export const defaultWorkingdata = [
  {
    email: "jj@example.com",
    date: "2018-10-11 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.EMAIL_VERIFICATION, actions.ID_VERIFICATION]
  },
  {
    email: "jj2@example.com",
    date: "2018-10-11 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.PROFILE_VERIFICATION]
  },
  {
    email: "j3@example.com",
    date: "2018-10-11 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.ID_VERIFICATION]
  },
  {
    email: "jj4@example.com",
    date: "2018-10-11 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.EMAIL_VERIFICATION, actions.PROFILE_VERIFICATION]
  },
  {
    email: "jj5@example.com",
    date: "2018-10-10 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.PROFILE_VERIFICATION]
  },
  {
    email: "jj6@example.com",
    date: "2018-10-10 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.ID_VERIFICATION]
  },
  {
    email: "jj7@example.com",
    date: "2018-10-10 12:30:33",
    full_name: "Donny Novak",
    actions: [actions.EMAIL_VERIFICATION]
  },
  {
    email: "jj8@example.com",
    date: "2018-10-9 12:30:33",
    full_name: "Donny Novak",
    actions: [
      actions.EMAIL_VERIFICATION,
      actions.ID_VERIFICATION,
      actions.ID_VERIFICATION
    ]
  }
];
function populateDetail(record) {
  return {
    ...record,
    phone_no: "07035209976",
    years_of_experience: "6-10 Years",
    tutor_description: `Ifeoluwa is a dedicated, resourceful and goal-driven professional educator with a solid commitment to the social and academic growth and development of every child. This I have been doing for 10 years now. I specialize in tutoring Numeracy, Literacy and sciences for Nursery, Primary and JSS students. I have successfully tutored students for common entrance,JSCE and BECE. I also have a strong passion in seeing my learners write with a good and eligible handwriting. I have a strong believe in Child-centred curriculum and aptitude to remain flexible, ensuring that every child learning styles and abilities are addressed. I provide assessment and feedback both to my learners and parent if applicable.`,

    locations: [
      {
        address: "20 Harrison Ojemen Street",
        state: "Lagos",
        vicinity: "GRA"
      }
    ],
    educations: [
      {
        school: "University of Lagos",
        course: "Systems Engineering",
        degree: "MSC"
      },
      {
        school: "University of Lagos2",
        course: "Systems Engineering",
        degree: "MSC"
      }
    ],
    work_experiences: [
      { name: "Tuteria Developer", role: "Backend Developer" },
      { name: "Tuteria Developer2", role: "Backend Developer" }
    ],
    potential_subjects: ["French", "English", "Physics"],
    levels_with_exam: {},
    answers: {},
    classes: ["Nursery 2", "Primary 3", "JSS1"],
    curriculum_used: ["British", "American"],
    currriculum_explanation:
      "It is an Interesting curriculum that helps growing child especially in Reading and number work."
  };
}
export const tutorList = [
  {
    slug: "kenny2",
    profile_pic: logo,
    identification: {
      link: "http://www.gogole.com",
      verified: false
    },
    full_name: "Kenny Novak",
    email: "jj9@example.com",
    dob: "2012-10-11 12:30:33",
    state: "Lagos",
    gender: "M",
    verified: true,
    email_verified: false
  },
  {
    slug: "james4",
    profile_pic: "",
    identification: {
      link: "http://www.gogole.com",
      verified: false
    },
    full_name: "Donny Novak",
    email: "jj10@example.com",
    dob: "2012-10-11 12:30:33",
    state: "Lagos",
    gender: "M",
    verified: true,
    email_verified: false
  },
  {
    slug: "james1",
    profile_pic: logo,
    identification: {
      link: "http://www.gogole.com",
      verified: true
    },
    full_name: "James Novak",
    email: "james2@example.com",
    dob: "2012-10-11 12:30:33",
    state: "Lagos",
    gender: "M",
    verified: true,
    email_verified: false
  },
  {
    slug: "james2",
    profile_pic: logo,
    full_name: "Danny Novak",
    email: "james3@example.com",
    dob: "2012-10-11 12:30:33",
    state: "Lagos",
    gender: "M",
    verified: false,
    email_verified: true
  },
  {
    slug: "james3",
    profile_pic: "",
    identification: {
      link: "http://www.gogole.com",
      verified: false
    },
    email: "james4@example.com",
    full_name: "John Novak",
    dob: "2012-10-11 12:30:33",
    state: "Lagos",
    gender: "M",
    verified: true,
    email_verified: false
  },
  {
    slug: "jj101",
    profile_pic: "",
    email: "jj11@example.com",
    full_name: "Shola Novak",
    dob: "2012-10-11 12:30:33",
    state: "Lagos",
    gender: "M",
    verified: true,
    email_verified: false
  }
].map(x => ({ ...x, ...populateDetail(x) }));

export const sampleTutorDetailData = {
  profile_pic: logo,
  slug: "james3",
  full_name: "James Novak",
  dob: "2012-10-11 12:30:33",
  gender: "M",
  verified: true,
  email_verified: false,
  identification: {
    link: "http://www.gogole.com",
    verified: false
  },
  email: "james@example.com",
  phone_no: "07035209976",
  years_of_experience: "6-10 Years",
  tutor_description: `Ifeoluwa is a dedicated, resourceful and goal-driven professional educator with a solid commitment to the social and academic growth and development of every child. This I have been doing for 10 years now. I specialize in tutoring Numeracy, Literacy and sciences for Nursery, Primary and JSS students. I have successfully tutored students for common entrance,JSCE and BECE. I also have a strong passion in seeing my learners write with a good and eligible handwriting. I have a strong believe in Child-centred curriculum and aptitude to remain flexible, ensuring that every child learning styles and abilities are addressed. I provide assessment and feedback both to my learners and parent if applicable.`,
  educations: [
    {
      school: "University of Lagos",
      course: "Systems Engineering",
      degree: "MSC"
    },
    {
      school: "University of Lagos2",
      course: "Systems Engineering",
      degree: "MSC"
    }
  ],
  work_experiences: [
    { name: "Tuteria Developer", role: "Backend Developer" },
    { name: "Tuteria Developer2", role: "Backend Developer" }
  ],
  locations: [
    {
      address: "20 Harrison Ojemen Street",
      state: "Lagos",
      vicinity: "GRA"
    }
  ],
  potential_subjects: ["French", "English", "Physics"],
  levels_with_exam: {},
  answers: {},
  classes: ["Nursery 2", "Primary 3", "JSS1"],
  curriculum_used: ["British", "American"],
  currriculum_explanation:
    "It is an Interesting curriculum that helps growing child especially in Reading and number work."
};
export function getTutorDetail(key, value) {
  let rr = tutorList.find(x => x[key] === value);
  return rr || sampleTutorDetailData;
}
