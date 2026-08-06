// utils/aepsBanks.js
//
// DEPRECATED — unused. The bank list now comes from GET /aeps/banks (backed by the
// AepsBank table, seeded from NSDL's official IIN list) via useAepsTxnApi().banks()
// and aepsStore.fetchBanks(). See components/Merchant/Aeps/CustomerBankForm.vue.
//
// This file is kept only as a historical reference — it also had a bug where roughly
// half the entries used an inconsistent "IIN" key instead of "iin", which silently
// broke bank selection for those entries. Do not reintroduce it.
export const AEPS_BANKS = [
  {
    "iin": "508500",
    "BANK_NAME": "UNION BANK OF INDIA"
  },
  {
    "iin": "508505",
    "BANK_NAME": "BANK OF INDIA"
  },
  {
    "iin": "508534",
    "BANK_NAME": "ICICI BANK LIMITED"
  },
  {
    "iin": "508548",
    "BANK_NAME": "SBI"
  },
  {
    "iin": "508646",
    "BANK_NAME": "The Coimbatore District Central Co-op Bank Limited"
  },
  {
    "iin": "508647",
    "BANK_NAME": "THE CUDDALORE DISTRICT CENTRAL COOPERATIVE BANK"
  },
  {
    "iin": "508648",
    "BANK_NAME": "THE SALEM DISTRICT CENTRAL CO-OPERATIVE BANK LTD "
  },
  {
    "iin": "508649",
    "BANK_NAME": "THE SIVAGANGAI DISTRICT CENTRAL COOP BANK LTD"
  },
  {
    "iin": "508654",
    "BANK_NAME": "Erode District Central Co-operative Bank"
  },
  {
    "iin": "508655",
    "BANK_NAME": "The Kanyakumari District Central Cooperative Bank"
  },
  {
    "iin": "508656",
    "BANK_NAME": "Pudukottai District Central Cooperative Bank Ltd"
  },
  {
    "iin": "508657",
    "BANK_NAME": "The Tiruvannamalai District Central Coop Bank Ltd"
  },
  {
    "iin": "508658",
    "BANK_NAME": "Dharmapuri District Central Co op Bank Ltd"
  },
  {
    "iin": "508659",
    "BANK_NAME": "Dindigul Central Co-operative Bank Ltd"
  },
  {
    "iin": "508660",
    "BANK_NAME": "The Nilgiris District Central Coop Bank Ltd"
  },
  {
    "iin": "508662",
    "BANK_NAME": "KARUR VYSYA BANK"
  },
  {
    "iin": "508664",
    "BANK_NAME": "CHENNAI CENTRAL CO-OPERATIVE BANK LTD."
  },
  {
    "iin": "508665",
    "BANK_NAME": "Thanjavur Central Co op Bank Ltd"
  },
  {
    "iin": "508672",
    "BANK_NAME": "Shri Rajkot District Co Operative Bank Ltd"
  },
  {
    "iin": "508676",
    "BANK_NAME": "The Ramanathapuram District Central Co op Bank Ltd"
  },
  {
    "iin": "508677",
    "BANK_NAME": "The Tirunelveli District Central Co-op Bank Ltd"
  },
  {
    "iin": "508678",
    "BANK_NAME": "The Thoothukudi District Central Coop Bank Ltd"
  },
  {
    "iin": "508679",
    "BANK_NAME": "THE VELLORE DISTRICT CENTRAL CO-OP BANK LTD"
  },
  {
    "iin": "508680",
    "BANK_NAME": "THE TIRUCHIRAPALLI DIST. CENT COOPERATIVE BANK LTD"
  },
  {
    "iin": "508681",
    "BANK_NAME": "The Madurai District Central Cooperative Bank Ltd"
  },
  {
    "iin": "508720",
    "BANK_NAME": "The Kumbakonam Central Co-operative Bank Ltd"
  },
  {
    "iin": "508732",
    "BANK_NAME": "The Virudhunagar District Central Co-op Bank Ltd"
  },
  {
    "iin": "508734",
    "BANK_NAME": "KANCHEEPURAM CENTRAL COOPERATIVE BANK"
  },
  {
    "iin": "508737",
    "BANK_NAME": "THE VILLUPURAM DISTRICT CENTRAL CO-OP BANK LTD"
  },
  {
    "iin": "508754",
    "BANK_NAME": "The Angul United Central Co-op. Bank Ltd"
  },
  {
    "iin": "508755",
    "BANK_NAME": "The Koraput Central Co-operative Bank Ltd"
  },
  {
    "IIN": "508756",
    "BANK_NAME": "MAYURBHANJ CENTRAL COOP BANK LTD"
  },
  {
    "IIN": "508757",
    "BANK_NAME": "The Sundargarh District Central Co-Op. Bank Ltd"
  },
  {
    "IIN": "508758",
    "BANK_NAME": "The Balasore Bhadrak Central Co-Op. Bank Ltd"
  },
  {
    "IIN": "508759",
    "BANK_NAME": "The Berhampore Co Operative Central Bank Ltd"
  },
  {
    "IIN": "508760",
    "BANK_NAME": "The Keonjhar Central Cooperative Bank Ltd."
  },
  {
    "IIN": "508761",
    "BANK_NAME": "THE BANKI CENTRAL COOP BANK LTD"
  },
  {
    "IIN": "508771",
    "BANK_NAME": "The Khordha Central Co-Op. Bank Ltd."
  },
  {
    "IIN": "508772",
    "BANK_NAME": "Nayagarh District Central Cooperative Bank Ltd"
  },
  {
    "IIN": "508773",
    "BANK_NAME": "The Aska Cooperative Central Bank Ltd."
  },
  {
    "IIN": "508774",
    "BANK_NAME": "The Bolangir District Central Co-operative Bank Ltd"
  },
  {
    "IIN": "508775",
    "BANK_NAME": "The The Boudh Cooperative Central Bank Ltd"
  },
  {
    "IIN": "508776",
    "BANK_NAME": "The Cuttack Central Co-operative bank Ltd"
  },
  {
    "IIN": "508777",
    "BANK_NAME": "The Sambalpur District Cooperative Central Bank Ltd"
  },
  {
    "IIN": "508778",
    "BANK_NAME": "The Bhawanipatna Central Cooperative Bank Ltd"
  },
  {
    "IIN": "508782",
    "BANK_NAME": "The United Puri-Nimpara Central Co-Op. Bank Ltd"
  },
  {
    "IIN": "508910",
    "BANK_NAME": "Jana Small Finance Bank"
  },
  {
    "IIN": "508913",
    "BANK_NAME": "Capital Small Finance Bank"
  },
  {
    "IIN": "508991",
    "BANK_NAME": "Ujjivan Small Finance Bank"
  },
  {
    "IIN": "508998",
    "BANK_NAME": "Equitas Small Finance Bank"
  },
  {
    "IIN": "606985",
    "BANK_NAME": "BANK OF BARODA"
  },
  {
    "IIN": "606993",
    "BANK_NAME": "BANK OF BARODA UP GRAMIN BANK"
  },
  {
    "IIN": "606995",
    "BANK_NAME": "BARODA GUJARAT GRAMIN BANK"
  },
  {
    "IIN": "607000",
    "BANK_NAME": "MGB"
  },
  {
    "IIN": "607020",
    "BANK_NAME": "VIDHARBHA KONKAN GRAMIN BANK HO NAGPUR"
  },
  {
    "IIN": "607021",
    "BANK_NAME": "JHARKHAND GB-RANCHI BR"
  },
  {
    "IIN": "607022",
    "BANK_NAME": "NARMADA MALWA GB-INDORE BR"
  },
  {
    "IIN": "607024",
    "BANK_NAME": "ARYAVART GB-GOMTI NAGAR BR"
  },
  {
    "IIN": "607027",
    "BANK_NAME": "PUNJAB NATIONAL BANK"
  },
  {
    "IIN": "607051",
    "BANK_NAME": "THE A.P. MAHESH COOPERATIVE URBAN BANK LIMITED"
  },
  {
    "IIN": "607052",
    "BANK_NAME": "Pallavan Grama Bank"
  },
  {
    "IIN": "607053",
    "BANK_NAME": "Saptagiri Grameena Bank"
  },
  {
    "IIN": "607054",
    "BANK_NAME": "Puduvai Bharthiar Grama Bank"
  },
  {
    "IIN": "607058",
    "BANK_NAME": "LAXMI VILAS BANK"
  },
  {
    "IIN": "607059",
    "BANK_NAME": "IOB RRB PANDYAN GRAMA BANK"
  },
  {
    "IIN": "607060",
    "BANK_NAME": "IOB, RRB, ODISHA GRAMYA BANK"
  },
  {
    "IIN": "607062",
    "BANK_NAME": "MANIPUR RURAL BANK"
  },
  {
    "IIN": "607063",
    "BANK_NAME": "BANGIYA GRAMIN VIKASH BANK"
  },
  {
    "IIN": "607064",
    "BANK_NAME": "ASSAM GRAMIN VIKASH BANK"
  },
  {
    "IIN": "607065",
    "BANK_NAME": "TRIPURA GRAMIN BANK"
  },
  {
    "IIN": "607066",
    "BANK_NAME": "UCO BANK"
  },
  {
    "IIN": "607069",
    "BANK_NAME": "UTTAR BIHAR GRAMIN BANK; MUZAFFARPUR"
  },
  {
    "IIN": "607073",
    "BANK_NAME": "UTTAR BANGA KSHETRIYA GRAMIN BANK; COOCHBEHAR"
  },
  {
    "IIN": "607079",
    "BANK_NAME": "PASCHIM BANGA GRAMIN BANK-RRB"
  },
  {
    "IIN": "607080",
    "BANK_NAME": "Chaitanya Godavari Gramin Bank"
  },
  {
    "IIN": "607082",
    "BANK_NAME": "CATHOLIC SYRIAN BANK LIMITED"
  },
  {
    "IIN": "607087",
    "BANK_NAME": "PUNJAB AND SIND BANK"
  },
  {
    "IIN": "607091",
    "BANK_NAME": "ALLAHABAD UP GRAMIN-ORAI MAIN"
  },
  {
    "IIN": "607094",
    "BANK_NAME": "STATE BANK OF INDIA"
  },
  {
    "IIN": "607095",
    "BANK_NAME": "IDBI BANK"
  },
  {
    "IIN": "607099",
    "BANK_NAME": "Dena Gujarat Gramin Bank"
  },
  {
    "IIN": "607105",
    "BANK_NAME": "Allahabad bank (now Indian Bank)"
  },
  {
    "IIN": "607119",
    "BANK_NAME": "SHIVALIK MERCANTILE CO-OPERATIVE BANK"
  },
  {
    "IIN": "607121",
    "BANK_NAME": "ANDHRA PRAGATHI GRAMEENA BANK"
  },
  {
    "IIN": "607122",
    "BANK_NAME": "KARNATAKA VIKAS GRAMEENA BANK"
  },
  {
    "IIN": "607124",
    "BANK_NAME": "PRATHAMA BANK"
  },
  {
    "IIN": "607126",
    "BANK_NAME": "INDIAN OVERSEAS BANK"
  },
  {
    "IIN": "607131",
    "BANK_NAME": "THE TAMIL NADU STATE APEX COOPERATIVE BANK"
  },
  {
    "IIN": "607135",
    "BANK_NAME": "Sarva UP Gramin Bank"
  },
  {
    "IIN": "607136",
    "BANK_NAME": "Madhya bihar gramin bank"
  },
  {
    "IIN": "607138",
    "BANK_NAME": "Punjab National Gramin Bank"
  },
  {
    "IIN": "607139",
    "BANK_NAME": "Sarva Haryana gramin bank"
  },
  {
    "IIN": "607140",
    "BANK_NAME": "Himachal Pradesh Gramin Bank"
  },
  {
    "IIN": "607152",
    "BANK_NAME": "HDFC BANK"
  },
  {
    "IIN": "607153",
    "BANK_NAME": "AXIS BANK"
  },
  {
    "IIN": "607157",
    "BANK_NAME": "THE GAYATRI CO-OPERATIVE URBAN BANK LTD"
  },
  {
    "IIN": "607161",
    "BANK_NAME": "UNION BANK"
  },
  {
    "IIN": "607162",
    "BANK_NAME": "The Meghalaya Co Operative Apex Bank Ltd"
  },
  {
    "IIN": "607187",
    "BANK_NAME": "TAMILNAD MERCANTILE BANK LIMITED"
  },
  {
    "IIN": "607189",
    "BANK_NAME": "INDUSIND BANK"
  },
  {
    "IIN": "607195",
    "BANK_NAME": "Telangana Grameena Bank"
  },
  {
    "IIN": "607197",
    "BANK_NAME": "Uttarakhand Gramin Bank"
  },
  {
    "IIN": "607198",
    "BANK_NAME": "ANDHRA PRADESH GRAMEEN VIKAS BANK RRB"
  },
  {
    "IIN": "607200",
    "BANK_NAME": "SAURASHTRA GRAMIN BANK"
  },
  {
    "IIN": "607203",
    "BANK_NAME": "LANGPI DEHANGI RURAL BANK RRB"
  },
  {
    "IIN": "607206",
    "BANK_NAME": "MEGHALAYA RURAL BANK RRB"
  },
  {
    "IIN": "607210",
    "BANK_NAME": "VANANCHAL GRAMIN BANK"
  },
  {
    "IIN": "607212",
    "BANK_NAME": "PURVANCHAL GRAMIN BANK"
  },
  {
    "IIN": "607214",
    "BANK_NAME": "CHHATTISGARH GRAMIN BANK"
  },
  {
    "IIN": "607218",
    "BANK_NAME": "ELLAQUAI DEHATI BANK RRB"
  },
  {
    "IIN": "607230",
    "BANK_NAME": "MIZORAM RURAL BANK RRB"
  },
  {
    "IIN": "607232",
    "BANK_NAME": "MADHYA BHARAT GRAMIN BANK"
  },
  {
    "IIN": "607234",
    "BANK_NAME": "UTKAL GRAMYA BANK RRB"
  },
  {
    "IIN": "607241",
    "BANK_NAME": "NEFT MALWA GRAMIN BANK"
  },
  {
    "IIN": "607262",
    "BANK_NAME": "Sindhudurg District Central Cooperative Bank Ltd"
  },
  {
    "IIN": "607264",
    "BANK_NAME": "CENTRAL BANK OF INDIA"
  },
  {
    "IIN": "607266",
    "BANK_NAME": "Rajasthan State Coop Bank"
  },
  {
    "IIN": "607270",
    "BANK_NAME": "KARNATAKA BANK LIMITED"
  },
  {
    "IIN": "607280",
    "BANK_NAME": "BARODA RAJASTHAN GRAMIN BANK"
  },
  {
    "IIN": "607310",
    "BANK_NAME": "Sutlej Gramin Bank"
  },
  {
    "IIN": "607315",
    "BANK_NAME": "MAHARASHTRA STATE COOPERATIVE BANK"
  },
  {
    "IIN": "607324",
    "BANK_NAME": "CITY UNION BANK LIMITED"
  },
  {
    "IIN": "607363",
    "BANK_NAME": "FEDERAL BANK"
  },
  {
    "IIN": "607365",
    "BANK_NAME": "Kasi Gomati Bank"
  },
  {
    "IIN": "607387",
    "BANK_NAME": "BANK OF MAHARASHTRA"
  },
  {
    "IIN": "607393",
    "BANK_NAME": "RATNAKER BANK"
  },
  {
    "IIN": "607395",
    "BANK_NAME": "SBM BANK MAURITIUS LIMITED"
  },
  {
    "IIN": "607396",
    "BANK_NAME": "CANARA BANK"
  },
  {
    "IIN": "607399",
    "BANK_NAME": "KERALA GRAMIN BANK"
  },
  {
    "IIN": "607400",
    "BANK_NAME": "PRAGATHI KRISHNA GRAMIN BANK"
  },
  {
    "IIN": "607439",
    "BANK_NAME": "SOUTH INDIAN BANK"
  },
  {
    "IIN": "607440",
    "BANK_NAME": "JAMMU AND KASHMIR BANK LIMITED"
  },
  {
    "IIN": "607509",
    "BANK_NAME": "RAJASTHAN MARUDHARA GRAMIN BANK"
  },
  {
    "IIN": "607512",
    "BANK_NAME": "Karnataka Gramin Bank"
  },
  {
    "IIN": "607523",
    "BANK_NAME": "UP State Coop Bank"
  },
  {
    "IIN": "607602",
    "BANK_NAME": "Yavatmal District Central Co operative Bank Ltd"
  },
  {
    "IIN": "607603",
    "BANK_NAME": "Uttarakhand State Cooperative Bank Ltd"
  },
  {
    "IIN": "607618",
    "BANK_NAME": "YES BANK"
  },
  {
    "IIN": "607628",
    "BANK_NAME": "Pune District Central Co Operative Bank Ltd"
  },
  {
    "IIN": "607749",
    "BANK_NAME": "Kolhapur District Central Co operative Bank Ltd"
  },
  {
    "IIN": "607768",
    "BANK_NAME": "NSDL payments bank limited"
  },
  {
    "IIN": "607808",
    "BANK_NAME": "J and K Grameen Bank"
  },
  {
    "IIN": "607847",
    "BANK_NAME": "Bhandara Dist Coop Bank"
  },
  {
    "IIN": "607884",
    "BANK_NAME": "Jio Payments Bank limited"
  },
  {
    "IIN": "607935",
    "BANK_NAME": "Odisha State Co-operative Bank"
  },
  {
    "IIN": "607943",
    "BANK_NAME": "Solapur district co operative Bank"
  },
  {
    "IIN": "607978",
    "BANK_NAME": "TRIPURA STATE CO-OPERATIVE BANK LIMITED"
  },
  {
    "IIN": "608001",
    "BANK_NAME": "Fino Payment Bank"
  },
  {
    "IIN": "608009",
    "BANK_NAME": "The Gujrat State Co Operative Bank Ltd"
  },
  {
    "IIN": "608014",
    "BANK_NAME": "Utkarsh Small Finance Bank"
  },
  {
    "IIN": "608022",
    "BANK_NAME": "Suryoday Small Finance Bank"
  },
  {
    "IIN": "608032",
    "BANK_NAME": "Paytm payment Bank"
  },
  {
    "IIN": "608087",
    "BANK_NAME": "AU SMALL FINANCE BANK LIMITED"
  },
  {
    "IIN": "608117",
    "BANK_NAME": "IDFC BANK LIMITED"
  },
  {
    "IIN": "608165",
    "BANK_NAME": "Kerela State Cooperative Bank Ltd"
  },
  {
    "IIN": "608194",
    "BANK_NAME": "THE COSMOS CO OPERATIVE BANK LIMITED"
  },
  {
    "IIN": "608236",
    "BANK_NAME": "Ahmedabad District Central Cooperative Bank"
  },
  {
    "IIN": "608314",
    "BANK_NAME": "INDIA POST PAYMENT BANK"
  },
  {
    "IIN": "652150",
    "BANK_NAME": "SARASWAT COOPERATIVE BANK LIMITED"
  },
  {
    "IIN": "652254",
    "BANK_NAME": "ESAF Small Finance Bank"
  },
  {
    "IIN": "817304",
    "BANK_NAME": "FINCARE SMALL FINANCE BANK LTD"
  },
  {
    "IIN": "990309",
    "BANK_NAME": "KOTAK MAHINDRA BANK LIMITED"
  },
  {
    "IIN": "990320",
    "BANK_NAME": "Airtel Payment Bank"
  },
  {
    "IIN": "990558",
    "BANK_NAME": "Nainital Bank"
  }
];

export function bankNameByIin(iin) {
  return AEPS_BANKS.find((b) => b.iin === iin)?.name ?? "";
}
