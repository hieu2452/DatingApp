using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dob)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow.CurrentDateTime());

            var age = today.Year - dob.Year;

            if (dob > today.AddYears(-age))
            {
                age--;
            }

            return age;
        }
        public static DateTime CurrentDateTime(this DateTime dt)
        {
            TimeZoneInfo localTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok");

            DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(dt, localTimeZone);

            return localTime;
        }
    }
}