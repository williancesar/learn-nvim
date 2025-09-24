using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace VisualBlockPractice
{
    /// <summary>
    /// Practice file for visual block mode operations:
    /// Practice: Ctrl-v (visual block), I (insert at start), A (append at end)
    /// Practice block editing, column selection, and multi-line editing
    /// Focus on data tables, aligned content, and columnar operations
    /// </summary>
    public class DataTableProcessor
    {
        // Practice visual block editing on these aligned data structures
        private readonly string[] ProductCodes = {
            "PROD001",
            "PROD002",
            "PROD003",
            "PROD004",
            "PROD005",
            "PROD006",
            "PROD007",
            "PROD008",
            "PROD009",
            "PROD010"
        };

        private readonly string[] ProductNames = {
            "Laptop Computer    ",
            "Desktop Monitor   ",
            "Wireless Mouse    ",
            "Mechanical Keyboard",
            "USB Cable         ",
            "Power Adapter     ",
            "External Hard Drive",
            "Graphics Card     ",
            "Memory Module     ",
            "Sound Card        "
        };

        private readonly decimal[] ProductPrices = {
            1299.99m,
            399.99m,
            29.99m,
            149.99m,
            12.99m,
            79.99m,
            249.99m,
            899.99m,
            199.99m,
            149.99m
        };

        private readonly int[] QuantityInStock = {
            25,
            18,
            150,
            45,
            200,
            75,
            30,
            12,
            60,
            35
        };

        private readonly string[] Categories = {
            "Electronics",
            "Electronics",
            "Accessories",
            "Accessories",
            "Accessories",
            "Electronics",
            "Storage    ",
            "Electronics",
            "Electronics",
            "Electronics"
        };

        private readonly string[] Suppliers = {
            "TechCorp Ltd    ",
            "DisplayMakers   ",
            "PeripheralCo    ",
            "KeyboardExperts ",
            "CableSuppliers  ",
            "PowerSolutions  ",
            "StorageSpecialists",
            "GraphicsInc     ",
            "MemoryMasters   ",
            "AudioTech       "
        };

        // Practice block operations on this formatted data table
        public string GenerateInventoryReport()
        {
            var report = new StringBuilder();

            report.AppendLine("INVENTORY REPORT - PRODUCT CATALOG");
            report.AppendLine("========================================");
            report.AppendLine();

            // Header row - practice visual block selection here
            report.AppendLine("CODE    | NAME                | PRICE     | QTY | CATEGORY    | SUPPLIER");
            report.AppendLine("--------|---------------------|-----------|-----|-------------|------------------");

            // Data rows - practice block editing operations here
            for (int i = 0; i < ProductCodes.Length; i++)
            {
                report.AppendLine($"{ProductCodes[i],-7} | {ProductNames[i],-19} | {ProductPrices[i],9:C} | {QuantityInStock[i],3} | {Categories[i],-11} | {Suppliers[i]}");
            }

            report.AppendLine("--------|---------------------|-----------|-----|-------------|------------------");
            report.AppendLine($"TOTAL   | {ProductCodes.Length} PRODUCTS          | {ProductPrices.Sum(),9:C} |     |             |");

            return report.ToString();
        }

        // Practice block operations on this sales data
        public string GenerateSalesReport()
        {
            var report = new StringBuilder();

            report.AppendLine("QUARTERLY SALES REPORT");
            report.AppendLine("======================");
            report.AppendLine();

            // Sales data matrix - perfect for visual block operations
            report.AppendLine("PRODUCT   | Q1_2024 | Q2_2024 | Q3_2024 | Q4_2024 | TOTAL   | AVG");
            report.AppendLine("----------|---------|---------|---------|---------|---------|--------");
            report.AppendLine("PROD001   |  125000 |  138000 |  142000 |  156000 |  561000 | 140250");
            report.AppendLine("PROD002   |   87000 |   92000 |   89000 |   94000 |  362000 |  90500");
            report.AppendLine("PROD003   |   15000 |   18000 |   22000 |   25000 |   80000 |  20000");
            report.AppendLine("PROD004   |   45000 |   48000 |   52000 |   55000 |  200000 |  50000");
            report.AppendLine("PROD005   |    8000 |    9000 |   10000 |   12000 |   39000 |   9750");
            report.AppendLine("PROD006   |   32000 |   35000 |   38000 |   41000 |  146000 |  36500");
            report.AppendLine("PROD007   |   78000 |   82000 |   85000 |   88000 |  333000 |  83250");
            report.AppendLine("PROD008   |  234000 |  245000 |  258000 |  267000 | 1004000 | 251000");
            report.AppendLine("PROD009   |   67000 |   72000 |   75000 |   78000 |  292000 |  73000");
            report.AppendLine("PROD010   |   54000 |   58000 |   61000 |   64000 |  237000 |  59250");
            report.AppendLine("----------|---------|---------|---------|---------|---------|--------");
            report.AppendLine("TOTALS    |  745000 |  797000 |  832000 |  880000 | 3254000 | 813500");
            report.AppendLine("GROWTH %  |     0.0 |     7.0 |     4.4 |     5.8 |    16.2 |   4.05");

            return report.ToString();
        }

        // Practice visual block on employee data
        public string GenerateEmployeeDirectory()
        {
            var report = new StringBuilder();

            report.AppendLine("EMPLOYEE DIRECTORY");
            report.AppendLine("==================");
            report.AppendLine();

            // Employee data table - great for block selection practice
            report.AppendLine("ID   | LAST NAME    | FIRST NAME | DEPARTMENT   | POSITION           | EXT  | EMAIL");
            report.AppendLine("-----|--------------|------------|--------------|--------------------|----- |------------------------");
            report.AppendLine("1001 | Anderson     | Sarah      | Engineering  | Senior Developer   | 2145 | s.anderson@company.com");
            report.AppendLine("1002 | Brown        | Michael    | Sales        | Account Manager    | 3201 | m.brown@company.com");
            report.AppendLine("1003 | Chen         | Lisa       | Marketing    | Marketing Coord    | 4156 | l.chen@company.com");
            report.AppendLine("1004 | Davis        | Robert     | Engineering  | Lead Developer     | 2189 | r.davis@company.com");
            report.AppendLine("1005 | Evans        | Jennifer   | HR           | HR Specialist      | 5234 | j.evans@company.com");
            report.AppendLine("1006 | Foster       | David      | Finance      | Financial Analyst  | 6178 | d.foster@company.com");
            report.AppendLine("1007 | Garcia       | Maria      | Operations   | Operations Manager | 7245 | m.garcia@company.com");
            report.AppendLine("1008 | Harris       | James      | Engineering  | Software Architect | 2167 | j.harris@company.com");
            report.AppendLine("1009 | Johnson      | Patricia   | Sales        | Sales Director     | 3289 | p.johnson@company.com");
            report.AppendLine("1010 | Kim          | Andrew     | Marketing    | Brand Manager      | 4223 | a.kim@company.com");
            report.AppendLine("1011 | Lopez        | Amanda     | Finance      | Senior Accountant  | 6134 | a.lopez@company.com");
            report.AppendLine("1012 | Miller       | Christopher| Operations   | Logistics Coord    | 7298 | c.miller@company.com");
            report.AppendLine("1013 | Nelson       | Michelle   | HR           | Recruiter          | 5267 | m.nelson@company.com");
            report.AppendLine("1014 | O'Connor     | Daniel     | Engineering  | DevOps Engineer    | 2156 | d.oconnor@company.com");
            report.AppendLine("1015 | Parker       | Rachel     | Marketing    | Content Strategist | 4187 | r.parker@company.com");

            return report.ToString();
        }

        // Practice visual block operations on financial data
        public string GenerateFinancialSummary()
        {
            var report = new StringBuilder();

            report.AppendLine("FINANCIAL SUMMARY - MONTHLY BREAKDOWN");
            report.AppendLine("=====================================");
            report.AppendLine();

            // Financial data matrix - excellent for column operations
            report.AppendLine("ACCOUNT          | JAN_2024 | FEB_2024 | MAR_2024 | APR_2024 | MAY_2024 | JUN_2024");
            report.AppendLine("-----------------|----------|----------|----------|----------|----------|----------");
            report.AppendLine("Revenue_Product  |   485000 |   492000 |   518000 |   534000 |   567000 |   589000");
            report.AppendLine("Revenue_Service  |   123000 |   128000 |   134000 |   139000 |   145000 |   152000");
            report.AppendLine("Revenue_Licensing|    67000 |    69000 |    72000 |    75000 |    78000 |    81000");
            report.AppendLine("Cost_Materials   |   195000 |   198000 |   208000 |   215000 |   228000 |   237000");
            report.AppendLine("Cost_Labor       |   142000 |   145000 |   148000 |   151000 |   154000 |   157000");
            report.AppendLine("Cost_Overhead    |    58000 |    59000 |    61000 |    63000 |    65000 |    67000");
            report.AppendLine("Expense_Marketing|    45000 |    47000 |    49000 |    51000 |    53000 |    55000");
            report.AppendLine("Expense_Admin    |    67000 |    68000 |    69000 |    70000 |    71000 |    72000");
            report.AppendLine("Expense_Utilities|    12000 |    13000 |    11000 |    12000 |    14000 |    15000");
            report.AppendLine("Expense_Insurance|     8000 |     8000 |     8000 |     8000 |     8000 |     8000");
            report.AppendLine("-----------------|----------|----------|----------|----------|----------|----------");
            report.AppendLine("GROSS_REVENUE    |   675000 |   689000 |   724000 |   748000 |   790000 |   822000");
            report.AppendLine("TOTAL_COSTS      |   395000 |   402000 |   417000 |   429000 |   447000 |   461000");
            report.AppendLine("TOTAL_EXPENSES   |   132000 |   136000 |   137000 |   141000 |   146000 |   150000");
            report.AppendLine("NET_INCOME       |   148000 |   151000 |   170000 |   178000 |   197000 |   211000");
            report.AppendLine("PROFIT_MARGIN_%  |     21.9 |     21.9 |     23.5 |     23.8 |     24.9 |     25.7");

            return report.ToString();
        }

        // Practice block editing on configuration data
        public string GenerateConfigurationFile()
        {
            var config = new StringBuilder();

            config.AppendLine("# Application Configuration File");
            config.AppendLine("# Practice visual block operations on these settings");
            config.AppendLine();

            // Configuration settings - perfect for block editing
            config.AppendLine("[Database]");
            config.AppendLine("Host                = localhost");
            config.AppendLine("Port                = 5432");
            config.AppendLine("DatabaseName        = production_db");
            config.AppendLine("Username            = db_user");
            config.AppendLine("Password            = secure_password");
            config.AppendLine("ConnectionTimeout   = 30");
            config.AppendLine("CommandTimeout      = 60");
            config.AppendLine("MaxPoolSize         = 100");
            config.AppendLine("MinPoolSize         = 5");
            config.AppendLine();

            config.AppendLine("[Cache]");
            config.AppendLine("Provider            = Redis");
            config.AppendLine("ConnectionString    = localhost:6379");
            config.AppendLine("DefaultExpiration   = 3600");
            config.AppendLine("MaxMemorySize       = 1024");
            config.AppendLine("KeyPrefix           = app_cache_");
            config.AppendLine("EnableCompression   = true");
            config.AppendLine("SerializationFormat = JSON");
            config.AppendLine();

            config.AppendLine("[Logging]");
            config.AppendLine("Level               = Information");
            config.AppendLine("Console             = true");
            config.AppendLine("File                = true");
            config.AppendLine("FilePath            = /var/logs/app.log");
            config.AppendLine("MaxFileSize         = 10485760");
            config.AppendLine("MaxFiles            = 10");
            config.AppendLine("IncludeTimestamp    = true");
            config.AppendLine("IncludeLogLevel     = true");
            config.AppendLine("IncludeThreadId     = false");
            config.AppendLine();

            config.AppendLine("[Security]");
            config.AppendLine("EnableHttps         = true");
            config.AppendLine("RequireAuth         = true");
            config.AppendLine("JwtSecret           = your_jwt_secret_key");
            config.AppendLine("JwtExpiration       = 86400");
            config.AppendLine("EnableCors          = true");
            config.AppendLine("AllowedOrigins      = https://example.com");
            config.AppendLine("EnableRateLimit     = true");
            config.AppendLine("RequestsPerMinute   = 100");
            config.AppendLine("EnableEncryption    = true");
            config.AppendLine();

            config.AppendLine("[Features]");
            config.AppendLine("EnableCaching       = true");
            config.AppendLine("EnableMetrics       = true");
            config.AppendLine("EnableHealthChecks  = true");
            config.AppendLine("EnableSwagger       = false");
            config.AppendLine("EnableProfiling     = false");
            config.AppendLine("EnableDebugMode     = false");
            config.AppendLine("EnableExperimental  = false");

            return config.ToString();
        }

        // Practice visual block on test data
        public string GenerateTestDataSet()
        {
            var testData = new StringBuilder();

            testData.AppendLine("TEST DATA SET - USER ACCOUNTS");
            testData.AppendLine("=============================");
            testData.AppendLine();

            // Test data table - great for block operations practice
            testData.AppendLine("USER_ID | USERNAME     | EMAIL                    | FIRST_NAME | LAST_NAME  | ACTIVE | CREATED_DATE");
            testData.AppendLine("--------|--------------|--------------------------|------------|------------|--------|-------------");
            testData.AppendLine("   1001 | jsmith       | john.smith@email.com     | John       | Smith      | true   | 2024-01-15");
            testData.AppendLine("   1002 | mjohnson     | mary.johnson@email.com   | Mary       | Johnson    | true   | 2024-01-16");
            testData.AppendLine("   1003 | bwilliams    | bob.williams@email.com   | Bob        | Williams   | false  | 2024-01-17");
            testData.AppendLine("   1004 | sjones      | sarah.jones@email.com    | Sarah      | Jones      | true   | 2024-01-18");
            testData.AppendLine("   1005 | mbrown      | mike.brown@email.com     | Mike       | Brown      | true   | 2024-01-19");
            testData.AppendLine("   1006 | ldavis      | lisa.davis@email.com     | Lisa       | Davis      | false  | 2024-01-20");
            testData.AppendLine("   1007 | rmiller     | robert.miller@email.com  | Robert     | Miller     | true   | 2024-01-21");
            testData.AppendLine("   1008 | kwilson     | karen.wilson@email.com   | Karen      | Wilson     | true   | 2024-01-22");
            testData.AppendLine("   1009 | dmoore      | david.moore@email.com    | David      | Moore      | false  | 2024-01-23");
            testData.AppendLine("   1010 | jtaylor     | jennifer.taylor@email.com| Jennifer   | Taylor     | true   | 2024-01-24");
            testData.AppendLine("   1011 | canderson   | chris.anderson@email.com | Chris      | Anderson   | true   | 2024-01-25");
            testData.AppendLine("   1012 | athomas     | amy.thomas@email.com     | Amy        | Thomas     | false  | 2024-01-26");
            testData.AppendLine("   1013 | jjackson    | james.jackson@email.com  | James      | Jackson    | true   | 2024-01-27");
            testData.AppendLine("   1014 | swhite      | stephanie.white@email.com| Stephanie  | White      | true   | 2024-01-28");
            testData.AppendLine("   1015 | bharris     | brian.harris@email.com   | Brian      | Harris     | false  | 2024-01-29");

            return testData.ToString();
        }

        // Practice column operations on matrix data
        public string GeneratePerformanceMatrix()
        {
            var matrix = new StringBuilder();

            matrix.AppendLine("PERFORMANCE METRICS MATRIX");
            matrix.AppendLine("==========================");
            matrix.AppendLine();

            // Performance matrix - excellent for visual block practice
            matrix.AppendLine("METRIC           | TARGET | JAN | FEB | MAR | APR | MAY | JUN | AVG | STATUS");
            matrix.AppendLine("-----------------|--------|-----|-----|-----|-----|-----|-----|-----|--------");
            matrix.AppendLine("Response_Time_MS |    100 |  95 | 102 |  89 |  94 |  88 |  91 |  93 | GOOD");
            matrix.AppendLine("Uptime_Percent   |   99.9 |99.8 |99.9 |99.7 |99.9 |99.8 |99.9 |99.8 | GOOD");
            matrix.AppendLine("Error_Rate       |    0.1 | 0.2 | 0.1 | 0.3 | 0.1 | 0.2 | 0.1 | 0.2 | WARN");
            matrix.AppendLine("CPU_Usage        |     70 |  65 |  72 |  68 |  71 |  69 |  74 |  70 | GOOD");
            matrix.AppendLine("Memory_Usage     |     80 |  75 |  82 |  78 |  81 |  79 |  85 |  80 | GOOD");
            matrix.AppendLine("Disk_Usage       |     85 |  82 |  84 |  86 |  88 |  90 |  92 |  87 | WARN");
            matrix.AppendLine("Network_Latency  |     50 |  45 |  52 |  48 |  51 |  47 |  53 |  49 | GOOD");
            matrix.AppendLine("Throughput_RPS   |   1000 | 950 |1050 | 980 |1020 | 990 |1080 |1012 | GOOD");
            matrix.AppendLine("Concurrent_Users |    500 | 480 | 520 | 490 | 510 | 485 | 540 | 504 | GOOD");
            matrix.AppendLine("Cache_Hit_Rate   |     90 |  88 |  92 |  89 |  91 |  87 |  93 |  90 | GOOD");

            return matrix.ToString();
        }
    }
}