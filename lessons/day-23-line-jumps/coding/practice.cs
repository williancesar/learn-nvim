using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LineJumpsPractice
{
    /// <summary>
    /// Practice file for line targeting and bracket matching:
    /// Practice: gg, G, 42G, :42, Ctrl-g
    /// Practice bracket matching: %, [{ ]}, [( ]), [< ]>
    /// Focus on jumping to specific lines and matching brackets
    /// </summary>
    public class FinancialCalculationEngine
    {
        private readonly IInterestCalculator _interestCalculator;
        private readonly IAmortizationCalculator _amortizationCalculator;
        private readonly ITaxCalculator _taxCalculator;
        private readonly IInvestmentCalculator _investmentCalculator;

        public FinancialCalculationEngine(
            IInterestCalculator interestCalculator,
            IAmortizationCalculator amortizationCalculator,
            ITaxCalculator taxCalculator,
            IInvestmentCalculator investmentCalculator)
        {
            _interestCalculator = interestCalculator ?? throw new ArgumentNullException(nameof(interestCalculator));
            _amortizationCalculator = amortizationCalculator ?? throw new ArgumentNullException(nameof(amortizationCalculator));
            _taxCalculator = taxCalculator ?? throw new ArgumentNullException(nameof(taxCalculator));
            _investmentCalculator = investmentCalculator ?? throw new ArgumentNullException(nameof(investmentCalculator));
        }

        public async Task<LoanCalculationResult> CalculateLoanPaymentAsync(LoanCalculationRequest request)
        {
            try
            {
                if (request.Principal <= 0)
                {
                    return new LoanCalculationResult { IsSuccessful = false, ErrorMessage = "Principal must be greater than zero" };
                }

                if (request.AnnualInterestRate < 0 || request.AnnualInterestRate > 100)
                {
                    return new LoanCalculationResult { IsSuccessful = false, ErrorMessage = "Interest rate must be between 0 and 100" };
                }

                if (request.LoanTermInYears <= 0)
                {
                    return new LoanCalculationResult { IsSuccessful = false, ErrorMessage = "Loan term must be greater than zero" };
                }

                var monthlyInterestRate = (request.AnnualInterestRate / 100) / 12;
                var numberOfPayments = request.LoanTermInYears * 12;

                var monthlyPayment = await _interestCalculator.CalculateMonthlyPaymentAsync(
                    request.Principal,
                    monthlyInterestRate,
                    numberOfPayments
                );

                var totalInterest = (monthlyPayment * numberOfPayments) - request.Principal;
                var totalPayment = request.Principal + totalInterest;

                var amortizationSchedule = await _amortizationCalculator.GenerateAmortizationScheduleAsync(
                    request.Principal,
                    monthlyInterestRate,
                    numberOfPayments,
                    monthlyPayment
                );

                return new LoanCalculationResult
                {
                    IsSuccessful = true,
                    MonthlyPayment = monthlyPayment,
                    TotalInterest = totalInterest,
                    TotalPayment = totalPayment,
                    AmortizationSchedule = amortizationSchedule
                };
            }
            catch (Exception ex)
            {
                return new LoanCalculationResult { IsSuccessful = false, ErrorMessage = $"Calculation error: {ex.Message}" };
            }
        }

        public async Task<InvestmentProjectionResult> CalculateInvestmentProjectionAsync(InvestmentProjectionRequest request)
        {
            try
            {
                var projections = new List<InvestmentProjection>();
                var currentValue = request.InitialInvestment;

                for (int year = 1; year <= request.InvestmentPeriodInYears; year++)
                {
                    var annualContribution = request.MonthlyContribution * 12;
                    var interestEarned = currentValue * (request.ExpectedAnnualReturn / 100);

                    currentValue = currentValue + annualContribution + interestEarned;

                    var projection = new InvestmentProjection
                    {
                        Year = year,
                        BeginningBalance = currentValue - annualContribution - interestEarned,
                        AnnualContribution = annualContribution,
                        InterestEarned = interestEarned,
                        EndingBalance = currentValue
                    };

                    projections.Add(projection);
                }

                var totalContributions = request.InitialInvestment + (request.MonthlyContribution * 12 * request.InvestmentPeriodInYears);
                var totalGrowth = currentValue - totalContributions;

                return new InvestmentProjectionResult
                {
                    IsSuccessful = true,
                    FinalValue = currentValue,
                    TotalContributions = totalContributions,
                    TotalGrowth = totalGrowth,
                    Projections = projections
                };
            }
            catch (Exception ex)
            {
                return new InvestmentProjectionResult { IsSuccessful = false, ErrorMessage = $"Projection error: {ex.Message}" };
            }
        }

        public async Task<TaxCalculationResult> CalculateIncomeTaxAsync(TaxCalculationRequest request)
        {
            try
            {
                var taxBrackets = await _taxCalculator.GetTaxBracketsAsync(request.TaxYear, request.FilingStatus);
                var standardDeduction = await _taxCalculator.GetStandardDeductionAsync(request.TaxYear, request.FilingStatus);

                var adjustedGrossIncome = request.GrossIncome - request.AboveLineDeductions;
                var taxableIncome = Math.Max(0, adjustedGrossIncome - Math.Max(standardDeduction, request.ItemizedDeductions));

                var federalTax = CalculateTaxFromBrackets(taxableIncome, taxBrackets);
                var stateTax = await _taxCalculator.CalculateStateTaxAsync(taxableIncome, request.State);
                var totalTax = federalTax + stateTax - request.TaxCredits;

                var effectiveTaxRate = request.GrossIncome > 0 ? (totalTax / request.GrossIncome) * 100 : 0;
                var marginalTaxRate = GetMarginalTaxRate(taxableIncome, taxBrackets);

                return new TaxCalculationResult
                {
                    IsSuccessful = true,
                    AdjustedGrossIncome = adjustedGrossIncome,
                    TaxableIncome = taxableIncome,
                    FederalTax = federalTax,
                    StateTax = stateTax,
                    TotalTax = Math.Max(0, totalTax),
                    EffectiveTaxRate = effectiveTaxRate,
                    MarginalTaxRate = marginalTaxRate
                };
            }
            catch (Exception ex)
            {
                return new TaxCalculationResult { IsSuccessful = false, ErrorMessage = $"Tax calculation error: {ex.Message}" };
            }
        }

        public async Task<RetirementPlanningResult> CalculateRetirementNeedsAsync(RetirementPlanningRequest request)
        {
            try
            {
                var inflationAdjustedExpenses = request.EstimatedAnnualExpenses * Math.Pow(1 + (request.InflationRate / 100), request.YearsToRetirement);
                var requiredRetirementSavings = inflationAdjustedExpenses / (request.WithdrawalRate / 100);

                var currentAge = request.CurrentAge;
                var retirementAge = currentAge + request.YearsToRetirement;

                var projections = new List<RetirementProjection>();
                var currentSavings = request.CurrentSavings;

                for (int year = 1; year <= request.YearsToRetirement; year++)
                {
                    var annualContribution = request.MonthlyContribution * 12;
                    var investmentGrowth = currentSavings * (request.ExpectedReturn / 100);

                    currentSavings = currentSavings + annualContribution + investmentGrowth;

                    var projection = new RetirementProjection
                    {
                        Year = year,
                        Age = currentAge + year,
                        BeginningBalance = currentSavings - annualContribution - investmentGrowth,
                        AnnualContribution = annualContribution,
                        InvestmentGrowth = investmentGrowth,
                        EndingBalance = currentSavings
                    };

                    projections.Add(projection);
                }

                var shortfall = Math.Max(0, requiredRetirementSavings - currentSavings);
                var surplusFactor = currentSavings / requiredRetirementSavings;

                return new RetirementPlanningResult
                {
                    IsSuccessful = true,
                    RequiredRetirementSavings = requiredRetirementSavings,
                    ProjectedRetirementSavings = currentSavings,
                    Shortfall = shortfall,
                    SurplusFactor = surplusFactor,
                    InflationAdjustedExpenses = inflationAdjustedExpenses,
                    Projections = projections
                };
            }
            catch (Exception ex)
            {
                return new RetirementPlanningResult { IsSuccessful = false, ErrorMessage = $"Retirement planning error: {ex.Message}" };
            }
        }

        private decimal CalculateTaxFromBrackets(decimal taxableIncome, List<TaxBracket> brackets)
        {
            decimal totalTax = 0;
            decimal remainingIncome = taxableIncome;

            foreach (var bracket in brackets.OrderBy(b => b.MinIncome))
            {
                if (remainingIncome <= 0) break;

                var bracketIncome = bracket.MaxIncome.HasValue
                    ? Math.Min(remainingIncome, bracket.MaxIncome.Value - bracket.MinIncome + 1)
                    : remainingIncome;

                if (bracketIncome > 0)
                {
                    totalTax += bracketIncome * (bracket.TaxRate / 100);
                    remainingIncome -= bracketIncome;
                }
            }

            return totalTax;
        }

        private decimal GetMarginalTaxRate(decimal taxableIncome, List<TaxBracket> brackets)
        {
            foreach (var bracket in brackets.OrderByDescending(b => b.MinIncome))
            {
                if (taxableIncome >= bracket.MinIncome)
                {
                    return bracket.TaxRate;
                }
            }

            return 0;
        }
    }

    // Request models with complex bracket structures
    public class LoanCalculationRequest
    {
        public decimal Principal { get; set; }
        public decimal AnnualInterestRate { get; set; }
        public int LoanTermInYears { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Today;
    }

    public class InvestmentProjectionRequest
    {
        public decimal InitialInvestment { get; set; }
        public decimal MonthlyContribution { get; set; }
        public decimal ExpectedAnnualReturn { get; set; }
        public int InvestmentPeriodInYears { get; set; }
    }

    public class TaxCalculationRequest
    {
        public decimal GrossIncome { get; set; }
        public decimal Above LineDeductions { get; set; }
        public decimal ItemizedDeductions { get; set; }
        public decimal TaxCredits { get; set; }
        public int TaxYear { get; set; } = DateTime.Now.Year;
        public FilingStatus FilingStatus { get; set; } = FilingStatus.Single;
        public string State { get; set; } = "CA";
    }

    public class RetirementPlanningRequest
    {
        public int CurrentAge { get; set; }
        public int YearsToRetirement { get; set; }
        public decimal CurrentSavings { get; set; }
        public decimal MonthlyContribution { get; set; }
        public decimal ExpectedReturn { get; set; }
        public decimal EstimatedAnnualExpenses { get; set; }
        public decimal WithdrawalRate { get; set; } = 4.0m;
        public decimal InflationRate { get; set; } = 2.5m;
    }

    // Result models with nested structures and brackets
    public class LoanCalculationResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal MonthlyPayment { get; set; }
        public decimal TotalInterest { get; set; }
        public decimal TotalPayment { get; set; }
        public List<AmortizationEntry> AmortizationSchedule { get; set; } = new List<AmortizationEntry>();
    }

    public class InvestmentProjectionResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal FinalValue { get; set; }
        public decimal TotalContributions { get; set; }
        public decimal TotalGrowth { get; set; }
        public List<InvestmentProjection> Projections { get; set; } = new List<InvestmentProjection>();
    }

    public class TaxCalculationResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal AdjustedGrossIncome { get; set; }
        public decimal TaxableIncome { get; set; }
        public decimal FederalTax { get; set; }
        public decimal StateTax { get; set; }
        public decimal TotalTax { get; set; }
        public decimal EffectiveTaxRate { get; set; }
        public decimal MarginalTaxRate { get; set; }
    }

    public class RetirementPlanningResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal RequiredRetirementSavings { get; set; }
        public decimal ProjectedRetirementSavings { get; set; }
        public decimal Shortfall { get; set; }
        public decimal SurplusFactor { get; set; }
        public decimal InflationAdjustedExpenses { get; set; }
        public List<RetirementProjection> Projections { get; set; } = new List<RetirementProjection>();
    }

    // Supporting models with bracket-like structures
    public class AmortizationEntry
    {
        public int PaymentNumber { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal BeginningBalance { get; set; }
        public decimal PaymentAmount { get; set; }
        public decimal PrincipalPortion { get; set; }
        public decimal InterestPortion { get; set; }
        public decimal EndingBalance { get; set; }
    }

    public class InvestmentProjection
    {
        public int Year { get; set; }
        public decimal BeginningBalance { get; set; }
        public decimal AnnualContribution { get; set; }
        public decimal InterestEarned { get; set; }
        public decimal EndingBalance { get; set; }
    }

    public class RetirementProjection
    {
        public int Year { get; set; }
        public int Age { get; set; }
        public decimal BeginningBalance { get; set; }
        public decimal AnnualContribution { get; set; }
        public decimal InvestmentGrowth { get; set; }
        public decimal EndingBalance { get; set; }
    }

    public class TaxBracket
    {
        public decimal MinIncome { get; set; }
        public decimal? MaxIncome { get; set; }
        public decimal TaxRate { get; set; }
    }

    public enum FilingStatus
    {
        Single,
        MarriedFilingJointly,
        MarriedFilingSeparately,
        HeadOfHousehold,
        QualifyingWidow
    }

    // Service interfaces with method signatures containing brackets
    public interface IInterestCalculator
    {
        Task<decimal> CalculateMonthlyPaymentAsync(decimal principal, decimal monthlyRate, decimal numberOfPayments);
        Task<decimal> CalculateCompoundInterestAsync(decimal principal, decimal rate, int periods, int compoundingFrequency);
        Task<decimal> CalculatePresentValueAsync(decimal futureValue, decimal rate, int periods);
        Task<decimal> CalculateFutureValueAsync(decimal presentValue, decimal rate, int periods);
    }

    public interface IAmortizationCalculator
    {
        Task<List<AmortizationEntry>> GenerateAmortizationScheduleAsync(decimal principal, decimal monthlyRate, decimal numberOfPayments, decimal monthlyPayment);
        Task<decimal> CalculateRemainingBalanceAsync(decimal principal, decimal monthlyRate, int paymentsMade, decimal monthlyPayment);
    }

    public interface ITaxCalculator
    {
        Task<List<TaxBracket>> GetTaxBracketsAsync(int taxYear, FilingStatus filingStatus);
        Task<decimal> GetStandardDeductionAsync(int taxYear, FilingStatus filingStatus);
        Task<decimal> CalculateStateTaxAsync(decimal taxableIncome, string state);
        Task<decimal> CalculateSelfEmploymentTaxAsync(decimal selfEmploymentIncome);
    }

    public interface IInvestmentCalculator
    {
        Task<decimal> CalculateAnnualizedReturnAsync(decimal beginningValue, decimal endingValue, int years);
        Task<decimal> CalculatePortfolioValueAsync(List<Investment> investments);
        Task<decimal> CalculateRiskAdjustedReturnAsync(decimal returns, decimal riskFreeRate, decimal standardDeviation);
    }

    public class Investment
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Shares { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal CostBasis { get; set; }
        public DateTime PurchaseDate { get; set; }
    }
}