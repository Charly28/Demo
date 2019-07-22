using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
namespace HeadSpring.Core.Models
{
    [DataContract]
    public class EmployeeDto
    {
        [DataMember]
        public int EmployeeId { get; set; }

        [DataMember]
        public string UserId { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Name_Required")]
        [StringLength(50, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Name_Length")]
        public string Name { get; set; }


        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_LastName_Required")]
        [StringLength(50, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_LastName_Length")]
        public string LastName { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_MotherLastName_Required")]
        [StringLength(50, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_MotherLastName_Length")]
        public string MotherLastName { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Email_Required")]
        [StringLength(100, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Email_Length")]
        public string Email { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Phone_Required")]
        [StringLength(20, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Phone_Length")]
        public string Phone { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Location_Required")]
        [StringLength(50, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Location_Length")]
        public string Location { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_JobTitle_Required")]
        [StringLength(50, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_JobTitle_Length")]
        public string JobTitle { get; set; }

        [DataMember(IsRequired = true)]
        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "Employee_Active_Required")]
        public bool Active { get; set; }


        [DataMember]
        public string RoleName { get; set; }

        [DataMember]
        public bool RequiresUser { get; set; }
    }
}
