const insurancePackages = {
    0: {
      _id: 0,
      insuranceProvider: "ABC Default Health Insurance Co.",
      policyNumber: "P123456789",
      coverageType: "Health",
      coverageAmount: 50000.00,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      deductible: 1000.00,
      copay: 20.00,
      isPrimary: true,
    },
    
    1: {
      _id: 1,
      insuranceProvider: "XYZ Dental and Vision Insurance",
      policyNumber: "SP987654321",
      coverageType: "Dental and Vision",
      coverageAmount: 10000.00,
      startDate: "2023-02-01",
      endDate: "2023-12-31",
      deductible: 500.00,
      copay: 10.00,
      isPrimary: false,
    },

    2: {
      _id: 2,
      insuranceProvider: "LMN Special Health Insurance",
      policyNumber: "SP987697412",
      coverageType: "Health",
      coverageAmount: 10000.00,
      startDate: "2023-02-01",
      endDate: "2023-12-31",
      deductible: 700.00,
      copay: 15.00,
      isPrimary: false,
    },

    3: {
      _id: 3,
      insuranceProvider: "PQR Accident Insurance",
      policyNumber: "SP98788838",
      coverageType: "Accident",
      coverageAmount: 30000.00,
      startDate: "2023-05-01",
      endDate: "2023-12-31",
      deductible: 400.00,
      copay: 15.00,
      isPrimary: false,
    },

    4: {
      _id: 4,
      insuranceProvider: "GHI Disability Insurance",
      policyNumber: "SP98799999",
      coverageType: "Disability",
      coverageAmount: 20000.00,
      startDate: "2023-04-01",
      endDate: "2023-12-31",
      deductible: 800.00,
      copay: 10.00,
      isPrimary: false,
    },
  };
  
  module.exports = insurancePackages;
  