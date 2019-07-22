﻿USE HeadSpring
GO

CREATE TABLE [dbo].[Employees](
	[EmployeeId] [INT] IDENTITY(1,1) NOT NULL,
	[UserId] [NVARCHAR](128) NULL,
	[Name] [NVARCHAR](50) NOT NULL,
	[LastName] [NVARCHAR](50) NOT NULL,
	[MotherLastName] [NVARCHAR](50) NOT NULL,
	[Email] [NVARCHAR](100) NOT NULL,
	[Phone] [NVARCHAR](20) NOT NULL,
	[Location] [NVARCHAR](50) NOT NULL,
	[JobTitle] [NVARCHAR](50) NOT NULL,
	[Active] [BIT] NOT NULL,
 CONSTRAINT [PK_Table_1] PRIMARY KEY CLUSTERED 
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
