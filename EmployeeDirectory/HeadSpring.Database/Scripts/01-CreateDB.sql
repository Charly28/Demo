USE [master]
GO

DECLARE @sql VARCHAR(MAX)
DECLARE @sql_path VARCHAR(1000)
DECLARE @data_path VARCHAR(1000)
DECLARE @log_path VARCHAR(1000)
DECLARE @version VARCHAR(2)

SELECT @version = SUBSTRING(CONVERT(VARCHAR(100), SERVERPROPERTY('productversion')), 1, 2)

SET @sql_path = N'C:\Program Files\Microsoft SQL Server\MSSQL' + @version + '.SQLEXPRESS\MSSQL\DATA\'
SET @data_path = @sql_path + N'HeadSpring.mdf'
SET @log_path = @sql_path + N'HeadSpring_log.ldf'

SET @sql = '
CREATE DATABASE [HeadSpring] ON  PRIMARY 
( NAME = N''HeadSpring'', FILENAME = N''' + @data_path + ''', SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N''HeadSpring_log'', FILENAME = N''' + @log_path + ''' , SIZE = 2048KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
'
EXEC(@sql)

