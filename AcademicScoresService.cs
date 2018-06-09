using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class AcademicScoresService : IAcademicScoresService
    {
        readonly IDataProvider dataProvider;
        public AcademicScoresService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public List<AcademicScores> GetAll()
        {
            List<AcademicScores> results = new List<AcademicScores>();
            dataProvider.ExecuteCmd(
                "AcademicScores_GetAll",
                inputParamMapper: null,
                singleRecordMapper: (reader, resultSetNumber) =>
                {
                    AcademicScores academicScores = new AcademicScores();
                    academicScores.Id = (int)reader["Id"];
                    academicScores.UserId = (int)reader["UserId"];
                    academicScores.GPA = reader.GetSafeDecimalNullable("GPA");
                    academicScores.SAT = reader.GetSafeInt32Nullable("SAT");
                    academicScores.ACT = reader.GetSafeInt32Nullable("ACT");
                    academicScores.DateCreated = (DateTime)reader["DateCreated"];
                    academicScores.DateModified = (DateTime)reader["DateModified"];

                    results.Add(academicScores);
                });
            return results;
        }

        public AcademicScores GetById(int Id)
        {
            AcademicScores academicScores = null;
            dataProvider.ExecuteCmd(
                "academicscores_getbyid",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@Id", Id);
                },                  
                singleRecordMapper: (reader, resultsetnumber) =>
                {
                    academicScores = new AcademicScores();
                    academicScores.Id = (int)reader["id"];
                    academicScores.UserId = (int)reader["userid"];
                    academicScores.GPA = reader.GetSafeDecimalNullable("gpa");
                    academicScores.SAT = reader.GetSafeInt32Nullable("sat");
                    academicScores.ACT = reader.GetSafeInt32Nullable("act");
                    academicScores.DateCreated = (DateTime)reader["datecreated"];
                    academicScores.DateModified = (DateTime)reader["datemodified"];
                });
            return academicScores;
        }

        public int Create(AcademicScoresCreateRequest req)
        {
            int newId = 0;
            dataProvider.ExecuteNonQuery(
                "AcademicScores_Create",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@UserId", req.UserId);
                    parameters.AddWithValue("@GPA", req.GPA ?? (object)DBNull.Value);
                    parameters.AddWithValue("@SAT", req.SAT ?? (object)DBNull.Value);
                    parameters.AddWithValue("@ACT", req.ACT ?? (object)DBNull.Value);
                    parameters.Add("@Id", SqlDbType.Int).Direction = ParameterDirection.Output;
                },
                returnParameters: (parameters) =>
                {
                    newId = (int)parameters["@Id"].Value;
                });
            return newId;
        }

        public void Update(AcademicScoresUpdateRequest req)
        {
            dataProvider.ExecuteNonQuery(
                "AcademicScores_Update",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@Id", req.Id);
                    parameters.AddWithValue("@UserId", req.UserId);
                    parameters.AddWithValue("@GPA", req.GPA ?? (object)DBNull.Value);
                    parameters.AddWithValue("@SAT", req.SAT ?? (object)DBNull.Value);
                    parameters.AddWithValue("@ACT", req.ACT ?? (object)DBNull.Value);
                });
        }

        public void Delete(int Id)
        {
            dataProvider.ExecuteNonQuery(
                "AcademicScores_Delete",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@Id", Id);
                });
        }
    }
}
