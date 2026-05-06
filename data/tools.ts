import { Tool } from "@/types";

export const tools: Tool[] = [
  // HEALTH TOOLS
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    slug: "bmi-calculator",
    category: "health",
    shortDescription: "Calculate your Body Mass Index (BMI) based on weight and height.",
    longDescription: "The Body Mass Index (BMI) Calculator can be used to calculate BMI value and corresponding weight status while taking age into consideration. Use the 'Metric Units' tab for the International System of Units or the 'US Units' tab to convert units into either US or metric units.",
    metaTitle: "BMI Calculator - Calculate Your Body Mass Index Free",
    metaDescription: "Free online BMI calculator to find your Body Mass Index and weight status. Supports metric and US units.",
    keywords: ["bmi calculator", "body mass index", "health calculator", "weight status"],
    icon: "Scale",
    inputs: [
      { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 70", unit: "kg" },
      { name: "height", label: "Height", type: "number", placeholder: "e.g. 175", unit: "cm" }
    ],
    outputLabels: ["BMI Value", "Category"],
    faqs: [
      { question: "What is a healthy BMI?", answer: "For most adults, an ideal BMI is in the 18.5 to 24.9 range." },
      { question: "How is BMI calculated?", answer: "BMI is calculated by dividing your weight in kilograms by your height in meters squared (kg/m²)." }
    ],
    relatedTools: ["bmr-calculator", "ideal-weight-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true,
    formulaDescription: "BMI = weight (kg) / [height (m)]²",
    howToUse: ["Enter your weight in kilograms.", "Enter your height in centimeters.", "Click 'Calculate' to see your BMI and weight category."],
    exampleCalculation: "A person weighing 70kg with a height of 175cm: BMI = 70 / (1.75 * 1.75) = 22.86 (Healthy weight)"
  },
  {
    id: "bmr-calculator",
    title: "BMR Calculator",
    slug: "bmr-calculator",
    category: "health",
    shortDescription: "Calculate your Basal Metabolic Rate (BMR).",
    longDescription: "The Basal Metabolic Rate (BMR) Calculator estimates your basal metabolic rate—the amount of energy expended while at rest in a neutrally temperate environment.",
    metaTitle: "BMR Calculator - Basal Metabolic Rate Calculator",
    metaDescription: "Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body burns at rest.",
    keywords: ["bmr calculator", "basal metabolic rate", "calorie burn", "metabolism"],
    icon: "Flame",
    inputs: [
      { name: "age", label: "Age", type: "number", placeholder: "e.g. 25" },
      { name: "gender", label: "Gender", type: "select", options: [{label: "Male", value: "male"}, {label: "Female", value: "female"}] },
      { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 70", unit: "kg" },
      { name: "height", label: "Height", type: "number", placeholder: "e.g. 175", unit: "cm" }
    ],
    outputLabels: ["BMR (Mifflin-St Jeor)", "Daily Calories to Maintain Weight"],
    faqs: [
      { question: "What is BMR?", answer: "BMR is the number of calories your body needs to accomplish its most basic life-sustaining functions." }
    ],
    relatedTools: ["bmi-calculator", "tdee-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "tdee-calculator",
    title: "TDEE Calculator",
    slug: "tdee-calculator",
    category: "health",
    shortDescription: "Calculate your Total Daily Energy Expenditure (TDEE).",
    longDescription: "TDEE is an estimation of how many calories you burn per day when exercise is taken into account.",
    metaTitle: "TDEE Calculator - Total Daily Energy Expenditure",
    metaDescription: "Calculate your TDEE to know exactly how many calories you need to maintain, lose, or gain weight.",
    keywords: ["tdee calculator", "daily calories", "maintenance calories"],
    icon: "Zap",
    inputs: [
      { name: "age", label: "Age", type: "number", placeholder: "e.g. 25" },
      { name: "gender", label: "Gender", type: "select", options: [{label: "Male", value: "male"}, {label: "Female", value: "female"}] },
      { name: "weight", label: "Weight", type: "number", unit: "kg" },
      { name: "height", label: "Height", type: "number", unit: "cm" },
      { name: "activity", label: "Activity Level", type: "select", options: [
        {label: "Sedentary", value: 1.2},
        {label: "Lightly Active", value: 1.375},
        {label: "Moderately Active", value: 1.55},
        {label: "Very Active", value: 1.725},
        {label: "Extra Active", value: 1.9}
      ]}
    ],
    outputLabels: ["TDEE (Calories/Day)"],
    faqs: [],
    relatedTools: ["bmr-calculator", "calorie-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },

  // FINANCE TOOLS
  {
    id: "loan-emi-calculator",
    title: "Loan EMI Calculator",
    slug: "loan-emi-calculator",
    category: "finance",
    shortDescription: "Calculate monthly installments for any loan.",
    longDescription: "Loan EMI Calculator helps you calculate your Equated Monthly Installment for home loans, car loans, or personal loans.",
    metaTitle: "Loan EMI Calculator - Personal, Home, Car Loan EMI",
    metaDescription: "Calculate your loan EMI easily with our online calculator. Just enter the loan amount, interest rate, and tenure.",
    keywords: ["emi calculator", "loan calculator", "monthly installment"],
    icon: "Banknote",
    inputs: [
      { name: "amount", label: "Loan Amount", type: "number", placeholder: "e.g. 100000" },
      { name: "rate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 8.5" },
      { name: "tenure", label: "Tenure (Years)", type: "number", placeholder: "e.g. 5" }
    ],
    outputLabels: ["Monthly EMI", "Total Interest Payable", "Total Payment"],
    faqs: [],
    relatedTools: ["mortgage-calculator", "compound-interest-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    slug: "compound-interest-calculator",
    category: "finance",
    shortDescription: "Calculate how your investments grow over time.",
    longDescription: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.",
    metaTitle: "Compound Interest Calculator - Future Value of Investment",
    metaDescription: "Calculate compound interest for your savings or investments. See how your money grows over time.",
    keywords: ["compound interest", "investment calculator", "future value"],
    icon: "TrendingUp",
    inputs: [
      { name: "principal", label: "Principal Amount", type: "number" },
      { name: "rate", label: "Annual Interest Rate (%)", type: "number" },
      { name: "years", label: "Number of Years", type: "number" },
      { name: "frequency", label: "Compounding Frequency", type: "select", options: [
        {label: "Annually", value: 1},
        {label: "Semi-Annually", value: 2},
        {label: "Quarterly", value: 4},
        {label: "Monthly", value: 12},
        {label: "Daily", value: 365}
      ]}
    ],
    outputLabels: ["Future Value", "Total Interest Earned"],
    faqs: [],
    relatedTools: ["simple-interest-calculator", "sip-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },

  // MATH TOOLS
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    slug: "percentage-calculator",
    category: "math",
    shortDescription: "Easily calculate percentages, increases, and decreases.",
    longDescription: "The percentage calculator is a versatile tool for calculating percentage values and percentage changes.",
    metaTitle: "Percentage Calculator - Calculate Percentages Online",
    metaDescription: "Free online percentage calculator to find the percentage of a number, percentage increase/decrease, and more.",
    keywords: ["percentage calculator", "math tools", "percent off"],
    icon: "Percent",
    inputs: [
      { name: "value", label: "What is X percent of Y?", type: "text", placeholder: "Calculation mode..." },
      { name: "num1", label: "X (%)", type: "number" },
      { name: "num2", label: "of Y", type: "number" }
    ],
    outputLabels: ["Result"],
    faqs: [],
    relatedTools: ["ratio-calculator", "average-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },

  // CONVERSION TOOLS
  {
    id: "length-converter",
    title: "Length Converter",
    slug: "length-converter",
    category: "conversion",
    shortDescription: "Convert between different length units like meters, miles, etc.",
    longDescription: "Convert units of length easily including meters, kilometers, miles, yards, feet, and inches.",
    metaTitle: "Length Converter - Meters, Miles, Feet, Inches",
    metaDescription: "Quickly convert length and distance units online. Supports metric and imperial systems.",
    keywords: ["length converter", "unit conversion", "meters to feet"],
    icon: "Ruler",
    inputs: [
      { name: "value", label: "Value", type: "number" },
      { name: "from", label: "From Unit", type: "select", options: [
        {label: "Meters (m)", value: "m"},
        {label: "Kilometers (km)", value: "km"},
        {label: "Centimeters (cm)", value: "cm"},
        {label: "Miles (mi)", value: "mi"},
        {label: "Feet (ft)", value: "ft"},
        {label: "Inches (in)", value: "in"}
      ]},
      { name: "to", label: "To Unit", type: "select", options: [
        {label: "Meters (m)", value: "m"},
        {label: "Kilometers (km)", value: "km"},
        {label: "Centimeters (cm)", value: "cm"},
        {label: "Miles (mi)", value: "mi"},
        {label: "Feet (ft)", value: "ft"},
        {label: "Inches (in)", value: "in"}
      ]}
    ],
    outputLabels: ["Converted Value"],
    faqs: [],
    relatedTools: ["weight-converter", "area-converter"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },

  // SEO TOOLS
  {
    id: "word-counter",
    title: "Word Counter",
    slug: "word-counter",
    category: "seo",
    shortDescription: "Count words, characters, and sentences in your text.",
    longDescription: "Word Counter is a free online tool that helps you count words, characters, sentences, and paragraphs in real-time.",
    metaTitle: "Word Counter - Online Word & Character Count Tool",
    metaDescription: "Free online word counter tool. Count words, characters, sentences, and more for your SEO content.",
    keywords: ["word counter", "character count", "content tool"],
    icon: "FileText",
    inputs: [
      { name: "text", label: "Your Text", type: "text", placeholder: "Paste your text here..." }
    ],
    outputLabels: ["Words", "Characters", "Sentences", "Paragraphs"],
    faqs: [],
    relatedTools: ["character-counter", "slug-generator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "body-fat-calculator",
    title: "Body Fat Calculator",
    slug: "body-fat-calculator",
    category: "health",
    shortDescription: "Estimate your body fat percentage.",
    longDescription: "The Body Fat Calculator uses the U.S. Navy method to provide an estimate of body fat percentage.",
    metaTitle: "Body Fat Calculator - U.S. Navy Method",
    metaDescription: "Estimate your body fat percentage with our free online calculator using age, gender, weight, and measurements.",
    keywords: ["body fat", "fat percentage", "health tools"],
    icon: "Dumbbell",
    inputs: [
      { name: "gender", label: "Gender", type: "select", options: [{label: "Male", value: "male"}, {label: "Female", value: "female"}] },
      { name: "weight", label: "Weight", type: "number", unit: "kg" },
      { name: "height", label: "Height", type: "number", unit: "cm" },
      { name: "neck", label: "Neck", type: "number", unit: "cm" },
      { name: "waist", label: "Waist", type: "number", unit: "cm" },
      { name: "hip", label: "Hip (Females only)", type: "number", unit: "cm" }
    ],
    outputLabels: ["Body Fat Percentage", "Body Fat Category"],
    faqs: [],
    relatedTools: ["bmi-calculator", "ideal-weight-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    slug: "ideal-weight-calculator",
    category: "health",
    shortDescription: "Find your ideal body weight.",
    longDescription: "Calculates the ideal body weight (IBW) based on height, gender, and age.",
    metaTitle: "Ideal Weight Calculator - Free Online Tool",
    metaDescription: "Find out what your ideal body weight should be based on various formulas like Devine, Miller, and Robinson.",
    keywords: ["ideal weight", "healthy weight", "ibw"],
    icon: "Target",
    inputs: [
      { name: "gender", label: "Gender", type: "select", options: [{label: "Male", value: "male"}, {label: "Female", value: "female"}] },
      { name: "height", label: "Height", type: "number", unit: "cm" }
    ],
    outputLabels: ["Ideal Weight (kg)"],
    faqs: [],
    relatedTools: ["bmi-calculator", "body-fat-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "mortgage-calculator",
    title: "Mortgage Calculator",
    slug: "mortgage-calculator",
    category: "finance",
    shortDescription: "Calculate your monthly mortgage payments.",
    longDescription: "Estimate your monthly mortgage payments including principal and interest.",
    metaTitle: "Mortgage Calculator - Home Loan Payments",
    metaDescription: "Calculate your monthly mortgage payments with our easy-to-use home loan calculator.",
    keywords: ["mortgage calculator", "home loan", "monthly payment"],
    icon: "Home",
    inputs: [
      { name: "price", label: "Home Price", type: "number" },
      { name: "downpayment", label: "Down Payment", type: "number" },
      { name: "rate", label: "Interest Rate (%)", type: "number" },
      { name: "years", label: "Loan Term (Years)", type: "number" }
    ],
    outputLabels: ["Monthly Payment"],
    faqs: [],
    relatedTools: ["loan-emi-calculator", "tax-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "sip-calculator",
    title: "SIP Calculator",
    slug: "sip-calculator",
    category: "finance",
    shortDescription: "Calculate returns on your Systemic Investment Plan.",
    longDescription: "SIP Calculator helps you estimate the future value of your monthly investments in mutual funds.",
    metaTitle: "SIP Calculator - Mutual Fund Investment Returns",
    metaDescription: "Calculate the future value of your monthly SIP investments with our online SIP calculator.",
    keywords: ["sip calculator", "mutual fund", "investment"],
    icon: "PieChart",
    inputs: [
      { name: "monthly", label: "Monthly Investment", type: "number" },
      { name: "rate", label: "Expected Return Rate (%)", type: "number" },
      { name: "years", label: "Duration (Years)", type: "number" }
    ],
    outputLabels: ["Invested Amount", "Estimated Returns", "Total Value"],
    faqs: [],
    relatedTools: ["compound-interest-calculator", "retirement-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "average-calculator",
    title: "Average Calculator",
    slug: "average-calculator",
    category: "math",
    shortDescription: "Find the mean, median, and mode of a data set.",
    longDescription: "Calculates the average (mean), median, mode, and range for a series of numbers.",
    metaTitle: "Average Calculator - Mean, Median, Mode",
    metaDescription: "Easily find the average and other statistical values for any set of numbers.",
    keywords: ["average calculator", "mean median mode", "math tools"],
    icon: "BarChart",
    inputs: [
      { name: "numbers", label: "Numbers (comma separated)", type: "text", placeholder: "e.g. 10, 20, 30" }
    ],
    outputLabels: ["Mean", "Median", "Mode", "Range"],
    faqs: [],
    relatedTools: ["percentage-calculator", "ratio-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "weight-converter",
    title: "Weight Converter",
    slug: "weight-converter",
    category: "conversion",
    shortDescription: "Convert units of weight like kg, lb, oz.",
    longDescription: "Easily convert between kilograms, pounds, ounces, grams, and tons.",
    metaTitle: "Weight Converter - KG to LB, Grams to Ounces",
    metaDescription: "Quick and easy weight conversion tool for all common units.",
    keywords: ["weight converter", "kg to lb", "unit conversion"],
    icon: "Anchor",
    inputs: [
      { name: "value", label: "Value", type: "number" },
      { name: "from", label: "From", type: "select", options: [
        {label: "Kilograms (kg)", value: "kg"},
        {label: "Grams (g)", value: "g"},
        {label: "Pounds (lb)", value: "lb"},
        {label: "Ounces (oz)", value: "oz"}
      ]},
      { name: "to", label: "To", type: "select", options: [
        {label: "Kilograms (kg)", value: "kg"},
        {label: "Grams (g)", value: "g"},
        {label: "Pounds (lb)", value: "lb"},
        {label: "Ounces (oz)", value: "oz"}
      ]}
    ],
    outputLabels: ["Converted Weight"],
    faqs: [],
    relatedTools: ["length-converter", "temperature-converter"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "temperature-converter",
    title: "Temperature Converter",
    slug: "temperature-converter",
    category: "conversion",
    shortDescription: "Convert between Celsius, Fahrenheit, and Kelvin.",
    longDescription: "A simple tool to convert temperatures between different scales.",
    metaTitle: "Temperature Converter - Celsius to Fahrenheit",
    metaDescription: "Convert Celsius to Fahrenheit and vice versa with our free online temperature converter.",
    keywords: ["temperature converter", "celsius to fahrenheit", "kelvin"],
    icon: "Thermometer",
    inputs: [
      { name: "value", label: "Temperature", type: "number" },
      { name: "from", label: "From", type: "select", options: [
        {label: "Celsius (°C)", value: "c"},
        {label: "Fahrenheit (°F)", value: "f"},
        {label: "Kelvin (K)", value: "k"}
      ]},
      { name: "to", label: "To", type: "select", options: [
        {label: "Celsius (°C)", value: "c"},
        {label: "Fahrenheit (°F)", value: "f"},
        {label: "Kelvin (K)", value: "k"}
      ]}
    ],
    outputLabels: ["Converted Temperature"],
    faqs: [],
    relatedTools: ["length-converter", "weight-converter"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "age-calculator",
    title: "Age Calculator",
    slug: "age-calculator",
    category: "date-time",
    shortDescription: "Calculate your exact age in years, months, and days.",
    longDescription: "The Age Calculator can determine the age or interval between two dates.",
    metaTitle: "Age Calculator - How Old Am I?",
    metaDescription: "Calculate your exact age in years, months, weeks, and days based on your date of birth.",
    keywords: ["age calculator", "how old am i", "date of birth"],
    icon: "User",
    inputs: [
      { name: "dob", label: "Date of Birth", type: "text", placeholder: "YYYY-MM-DD" }
    ],
    outputLabels: ["Age", "Months", "Days"],
    faqs: [],
    relatedTools: ["date-difference-calculator", "birthday-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "tip-calculator",
    title: "Tip Calculator",
    slug: "tip-calculator",
    category: "lifestyle",
    shortDescription: "Calculate tips and split bills easily.",
    longDescription: "Quickly calculate the tip amount and the total bill per person when splitting with friends.",
    metaTitle: "Tip Calculator - Split Bills Easily",
    metaDescription: "Free online tip calculator to split bills and calculate tips for restaurants and services.",
    keywords: ["tip calculator", "split bill", "restaurant tip"],
    icon: "Coffee",
    inputs: [
      { name: "bill", label: "Bill Amount", type: "number" },
      { name: "tipPercent", label: "Tip Percentage (%)", type: "number", defaultValue: 15 },
      { name: "people", label: "Number of People", type: "number", defaultValue: 1 }
    ],
    outputLabels: ["Tip Amount", "Total Bill", "Per Person"],
    faqs: [],
    relatedTools: ["split-bill-calculator", "fuel-cost-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "password-generator",
    title: "Password Generator",
    slug: "password-generator",
    category: "developer",
    shortDescription: "Generate strong, secure passwords.",
    longDescription: "Create random passwords with custom length and character sets to keep your accounts secure.",
    metaTitle: "Secure Password Generator - Create Strong Passwords",
    metaDescription: "Generate strong and random passwords with our free online tool. Customize length and characters.",
    keywords: ["password generator", "secure password", "random password"],
    icon: "Lock",
    inputs: [
      { name: "length", label: "Password Length", type: "number", defaultValue: 12 }
    ],
    outputLabels: ["Generated Password"],
    faqs: [],
    relatedTools: ["uuid-generator", "base64-encoder"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "calorie-calculator",
    title: "Calorie Calculator",
    slug: "calorie-calculator",
    category: "health",
    shortDescription: "Calculate daily calories needed for weight goals.",
    longDescription: "Estimate how many calories you need to maintain, lose, or gain weight based on your profile.",
    metaTitle: "Calorie Calculator - Weight Loss & Maintenance",
    metaDescription: "Find your daily calorie needs for weight loss or maintenance with our free calculator.",
    keywords: ["calorie calculator", "weight loss", "nutrition"],
    icon: "Utensils",
    inputs: [
      { name: "age", label: "Age", type: "number" },
      { name: "gender", label: "Gender", type: "select", options: [{label: "Male", value: "male"}, {label: "Female", value: "female"}] },
      { name: "weight", label: "Weight", type: "number", unit: "kg" },
      { name: "height", label: "Height", type: "number", unit: "cm" },
      { name: "activity", label: "Activity", type: "select", options: [{label: "Sedentary", value: 1.2}, {label: "Active", value: 1.55}] }
    ],
    outputLabels: ["Maintenance", "Weight Loss", "Weight Gain"],
    faqs: [],
    relatedTools: ["bmi-calculator", "tdee-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "simple-interest-calculator",
    title: "Simple Interest Calculator",
    slug: "simple-interest-calculator",
    category: "finance",
    shortDescription: "Calculate simple interest on principal.",
    longDescription: "A straightforward tool to calculate simple interest based on principal, rate, and time.",
    metaTitle: "Simple Interest Calculator - Free Online Tool",
    metaDescription: "Calculate simple interest for loans or savings with our easy calculator.",
    keywords: ["simple interest", "loan calculator", "finance"],
    icon: "Percent",
    inputs: [
      { name: "principal", label: "Principal", type: "number" },
      { name: "rate", label: "Rate (%)", type: "number" },
      { name: "years", label: "Years", type: "number" }
    ],
    outputLabels: ["Interest Amount", "Total Amount"],
    faqs: [],
    relatedTools: ["compound-interest-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "ratio-calculator",
    title: "Ratio Calculator",
    slug: "ratio-calculator",
    category: "math",
    shortDescription: "Simplify or calculate ratios.",
    longDescription: "Convert ratios to their simplest form or find missing values in a proportion.",
    metaTitle: "Ratio Calculator - Simplify & Compare Ratios",
    metaDescription: "Solve ratio problems and simplify ratios with our free math tool.",
    keywords: ["ratio calculator", "simplify ratio", "math"],
    icon: "Divide",
    inputs: [
      { name: "a", label: "A", type: "number" },
      { name: "b", label: "B", type: "number" }
    ],
    outputLabels: ["Simplified Ratio"],
    faqs: [],
    relatedTools: ["percentage-calculator", "average-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "character-counter",
    title: "Character Counter",
    slug: "character-counter",
    category: "seo",
    shortDescription: "Count total characters in your text.",
    longDescription: "Real-time character counting tool with and without spaces.",
    metaTitle: "Character Counter - Online Text Tool",
    metaDescription: "Count characters, letters, and spaces in your text instantly.",
    keywords: ["character counter", "text tool", "seo"],
    icon: "Type",
    inputs: [
      { name: "text", label: "Text", type: "text" }
    ],
    outputLabels: ["Characters (with spaces)", "Characters (no spaces)"],
    faqs: [],
    relatedTools: ["word-counter"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "slug-generator",
    title: "Slug Generator",
    slug: "slug-generator",
    category: "seo",
    shortDescription: "Convert text into SEO-friendly URL slugs.",
    longDescription: "Turn any title or text into a clean, URL-safe slug for your website.",
    metaTitle: "Slug Generator - URL Friendly Text Converter",
    metaDescription: "Create clean URL slugs from your titles. Perfect for SEO and blog posts.",
    keywords: ["slug generator", "url slug", "seo tools"],
    icon: "Link",
    inputs: [
      { name: "text", label: "Title/Text", type: "text" }
    ],
    outputLabels: ["URL Slug"],
    faqs: [],
    relatedTools: ["meta-checker"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "brm-calculator", // Duplicate of bmr but for safety
    title: "Basal Metabolic Rate",
    slug: "brm-calculator",
    category: "health",
    shortDescription: "Another BMR calculator variation.",
    longDescription: "Calculates BMR using the Harris-Benedict Equation.",
    metaTitle: "BMR Calculator - Harris-Benedict Equation",
    metaDescription: "Alternative BMR calculation method.",
    keywords: ["bmr", "calories"],
    icon: "Zap",
    inputs: [
      { name: "weight", label: "Weight", type: "number" },
      { name: "height", label: "Height", type: "number" },
      { name: "age", label: "Age", type: "number" },
      { name: "gender", label: "Gender", type: "select", options: [{label: "Male", value: "male"}, {label: "Female", value: "female"}] }
    ],
    outputLabels: ["BMR Value"],
    faqs: [],
    relatedTools: ["bmi-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  },
  {
    id: "salary-calculator",
    title: "Salary Calculator",
    slug: "salary-calculator",
    category: "finance",
    shortDescription: "Convert annual salary to hourly, weekly, etc.",
    longDescription: "See how much you earn per hour, day, week, and month based on your annual salary.",
    metaTitle: "Salary Converter - Hourly to Annual Calculator",
    metaDescription: "Convert your annual salary to hourly, daily, and monthly rates.",
    keywords: ["salary calculator", "hourly wage", "annual pay"],
    icon: "Wallet",
    inputs: [
      { name: "salary", label: "Annual Salary", type: "number" },
      { name: "hours", label: "Hours per Week", type: "number", defaultValue: 40 }
    ],
    outputLabels: ["Monthly", "Weekly", "Daily", "Hourly"],
    faqs: [],
    relatedTools: ["tax-calculator"],
    updatedAt: "2024-03-20",
    adsEnabled: true
  }
];
