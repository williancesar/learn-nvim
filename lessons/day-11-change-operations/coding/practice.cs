using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;

namespace VimPractice.ChangeOperations
{
    // Practice file for Day 11: Change Operations (c, cc, C, s, S, r, R)
    // This file contains legacy C# code that needs modernization
    // Practice changing old patterns to modern equivalents

    // Legacy class - needs modernization to modern C# patterns
    public class LegacyCustomerService
    {
        private string connectionString;
        private SqlConnection connection;
        private ArrayList customers;
        private Hashtable customerCache;

        // Legacy constructor - modernize to dependency injection pattern
        public LegacyCustomerService(string connStr)
        {
            this.connectionString = connStr;
            this.connection = new SqlConnection(connectionString);
            this.customers = new ArrayList();
            this.customerCache = new Hashtable();
        }

        // Legacy method - change to async/await pattern
        public ArrayList GetAllCustomers()
        {
            ArrayList result = new ArrayList();

            try
            {
                connection.Open();

                string sql = "SELECT * FROM Customers";
                SqlCommand command = new SqlCommand(sql, connection);
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    Hashtable customer = new Hashtable();
                    customer.Add("Id", reader["Id"]);
                    customer.Add("Name", reader["Name"]);
                    customer.Add("Email", reader["Email"]);
                    customer.Add("Phone", reader["Phone"]);
                    customer.Add("Address", reader["Address"]);

                    result.Add(customer);
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                // Legacy error handling - change to proper logging
                Console.WriteLine("Error: " + ex.Message);
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }

            return result;
        }

        // Legacy method with manual string building - change to LINQ and modern patterns
        public string GetCustomersByCity(string city)
        {
            StringBuilder result = new StringBuilder();
            result.Append("<customers>");

            for (int i = 0; i < customers.Count; i++)
            {
                Hashtable customer = (Hashtable)customers[i];
                string customerAddress = (string)customer["Address"];

                if (customerAddress != null && customerAddress.Contains(city))
                {
                    result.Append("<customer>");
                    result.Append("<id>" + customer["Id"] + "</id>");
                    result.Append("<name>" + customer["Name"] + "</name>");
                    result.Append("<email>" + customer["Email"] + "</email>");
                    result.Append("</customer>");
                }
            }

            result.Append("</customers>");
            return result.ToString();
        }

        // Legacy method with old-style null checking - change to modern null operators
        public Hashtable FindCustomerById(int customerId)
        {
            if (customerCache.ContainsKey(customerId))
            {
                return (Hashtable)customerCache[customerId];
            }

            for (int i = 0; i < customers.Count; i++)
            {
                Hashtable customer = (Hashtable)customers[i];

                if (customer["Id"] != null)
                {
                    int id = (int)customer["Id"];
                    if (id == customerId)
                    {
                        customerCache.Add(customerId, customer);
                        return customer;
                    }
                }
            }

            return null;
        }

        // Legacy validation method - change to modern validation patterns
        public bool ValidateCustomer(Hashtable customer)
        {
            if (customer == null)
            {
                return false;
            }

            if (customer["Name"] == null || customer["Name"].ToString().Length == 0)
            {
                return false;
            }

            if (customer["Email"] == null || customer["Email"].ToString().Length == 0)
            {
                return false;
            }

            string email = customer["Email"].ToString();
            if (email.IndexOf("@") == -1 || email.IndexOf(".") == -1)
            {
                return false;
            }

            return true;
        }

        // Legacy file processing - change to modern File.* methods and LINQ
        public void ProcessCustomerFile(string filePath)
        {
            FileStream fileStream = null;
            StreamReader reader = null;

            try
            {
                fileStream = new FileStream(filePath, FileMode.Open);
                reader = new StreamReader(fileStream);

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    if (line.Length > 0)
                    {
                        string[] parts = line.Split(',');

                        if (parts.Length >= 4)
                        {
                            Hashtable customer = new Hashtable();
                            customer.Add("Name", parts[0]);
                            customer.Add("Email", parts[1]);
                            customer.Add("Phone", parts[2]);
                            customer.Add("Address", parts[3]);

                            if (ValidateCustomer(customer))
                            {
                                customers.Add(customer);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("File processing error: " + ex.Message);
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }
                if (fileStream != null)
                {
                    fileStream.Close();
                }
            }
        }

        // Legacy XML processing - change to XDocument and LINQ to XML
        public void ExportToXml(string xmlFilePath)
        {
            XmlDocument doc = new XmlDocument();
            XmlElement root = doc.CreateElement("Customers");
            doc.AppendChild(root);

            for (int i = 0; i < customers.Count; i++)
            {
                Hashtable customer = (Hashtable)customers[i];

                XmlElement customerElement = doc.CreateElement("Customer");

                XmlElement nameElement = doc.CreateElement("Name");
                nameElement.InnerText = customer["Name"].ToString();
                customerElement.AppendChild(nameElement);

                XmlElement emailElement = doc.CreateElement("Email");
                emailElement.InnerText = customer["Email"].ToString();
                customerElement.AppendChild(emailElement);

                XmlElement phoneElement = doc.CreateElement("Phone");
                if (customer["Phone"] != null)
                {
                    phoneElement.InnerText = customer["Phone"].ToString();
                }
                customerElement.AppendChild(phoneElement);

                root.AppendChild(customerElement);
            }

            doc.Save(xmlFilePath);
        }

        // Legacy sorting - change to LINQ OrderBy
        public ArrayList SortCustomersByName()
        {
            ArrayList sortedCustomers = new ArrayList();

            // Manual bubble sort implementation
            for (int i = 0; i < customers.Count; i++)
            {
                for (int j = i + 1; j < customers.Count; j++)
                {
                    Hashtable customer1 = (Hashtable)customers[i];
                    Hashtable customer2 = (Hashtable)customers[j];

                    string name1 = customer1["Name"].ToString();
                    string name2 = customer2["Name"].ToString();

                    if (string.Compare(name1, name2) > 0)
                    {
                        // Swap
                        object temp = customers[i];
                        customers[i] = customers[j];
                        customers[j] = temp;
                    }
                }
            }

            return customers;
        }

        // Legacy search method - change to modern LINQ expressions
        public ArrayList SearchCustomers(string searchTerm)
        {
            ArrayList results = new ArrayList();

            if (searchTerm == null || searchTerm.Length == 0)
            {
                return results;
            }

            string lowerSearchTerm = searchTerm.ToLower();

            for (int i = 0; i < customers.Count; i++)
            {
                Hashtable customer = (Hashtable)customers[i];

                bool matches = false;

                if (customer["Name"] != null &&
                    customer["Name"].ToString().ToLower().IndexOf(lowerSearchTerm) >= 0)
                {
                    matches = true;
                }

                if (customer["Email"] != null &&
                    customer["Email"].ToString().ToLower().IndexOf(lowerSearchTerm) >= 0)
                {
                    matches = true;
                }

                if (customer["Phone"] != null &&
                    customer["Phone"].ToString().IndexOf(searchTerm) >= 0)
                {
                    matches = true;
                }

                if (matches)
                {
                    results.Add(customer);
                }
            }

            return results;
        }

        // Legacy disposal pattern - change to proper IDisposable implementation
        public void Cleanup()
        {
            if (connection != null)
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
                connection.Dispose();
                connection = null;
            }

            if (customers != null)
            {
                customers.Clear();
                customers = null;
            }

            if (customerCache != null)
            {
                customerCache.Clear();
                customerCache = null;
            }
        }
    }

    // Legacy data structure - change to modern record or class with properties
    public class LegacyCustomer
    {
        public int id;
        public string name;
        public string email;
        public string phone;
        public string address;
        public DateTime createdDate;
        public bool isActive;

        // Legacy constructor with all parameters
        public LegacyCustomer(int id, string name, string email, string phone, string address)
        {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.createdDate = DateTime.Now;
            this.isActive = true;
        }

        // Legacy string concatenation - change to string interpolation or StringBuilder
        public string GetDisplayText()
        {
            return "Customer: " + name + " (" + email + ") - Phone: " + phone +
                   ", Address: " + address + ", Created: " + createdDate.ToString("yyyy-MM-dd");
        }

        // Legacy comparison - change to IEquatable<T> or record equality
        public bool Equals(LegacyCustomer other)
        {
            if (other == null) return false;

            return this.id == other.id &&
                   this.name == other.name &&
                   this.email == other.email;
        }
    }

    // Legacy utility class - change to static class with extension methods
    public class LegacyStringHelper
    {
        // Legacy string manipulation - change to modern string methods
        public static string RemoveSpaces(string input)
        {
            if (input == null) return null;

            string result = "";
            for (int i = 0; i < input.Length; i++)
            {
                if (input[i] != ' ')
                {
                    result = result + input[i];
                }
            }
            return result;
        }

        // Legacy email validation - change to Regex or modern validation
        public static bool IsValidEmail(string email)
        {
            if (email == null || email.Length == 0)
                return false;

            int atIndex = email.IndexOf('@');
            if (atIndex <= 0 || atIndex >= email.Length - 1)
                return false;

            int dotIndex = email.LastIndexOf('.');
            if (dotIndex <= atIndex || dotIndex >= email.Length - 1)
                return false;

            return true;
        }

        // Legacy formatting - change to modern formatting approaches
        public static string FormatPhoneNumber(string phone)
        {
            if (phone == null || phone.Length != 10)
                return phone;

            return "(" + phone.Substring(0, 3) + ") " +
                   phone.Substring(3, 3) + "-" +
                   phone.Substring(6, 4);
        }
    }
}

// Practice Instructions for Change Operations:
// c{motion} - Change text covered by motion
// cc - Change entire line
// C - Change from cursor to end of line
// s - Substitute character (delete char and enter insert mode)
// S - Substitute line (delete line and enter insert mode)
// r{char} - Replace single character
// R - Enter replace mode
//
// Modernization targets in this file:
// 1. ArrayList -> List<T> or IEnumerable<T>
// 2. Hashtable -> Dictionary<TKey, TValue>
// 3. Manual loops -> LINQ expressions
// 4. String concatenation -> string interpolation
// 5. Manual null checks -> null operators (?., ??, ??=)
// 6. Synchronous methods -> async/await
// 7. Manual resource management -> using statements
// 8. XmlDocument -> XDocument
// 9. Manual sorting -> LINQ OrderBy
// 10. Public fields -> Properties with getters/setters
// 11. Legacy constructors -> Modern constructor patterns
// 12. Console.WriteLine -> ILogger
// 13. Manual string building -> StringBuilder or LINQ
// 14. Legacy disposal -> IDisposable pattern
// 15. Old exception handling -> modern exception patterns