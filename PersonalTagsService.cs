using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class PersonalTagsService : IPersonalTagsService
    {
        readonly IDataProvider dataProvider;
        public PersonalTagsService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public List<PersonalTag> GetAllForUser(int UserId)
        {
            List<PersonalTag> results = new List<PersonalTag>();
            dataProvider.ExecuteCmd(
                "PersonalTags_GetAllForUser",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@userId", UserId);
                },
                singleRecordMapper: (reader, resultSetNumber) =>
                {
                    PersonalTag personalTags = new PersonalTag();
                    personalTags.Id = (int)reader["id"];
                    personalTags.DateCreated = (DateTime)reader["dateCreated"];
                    personalTags.UserId = (int)reader["userId"];
                    personalTags.TargetId = (int)reader["targetId"];
                    personalTags.Tag = (string)reader["tag"];
                    personalTags.TargetType = (int)reader["targetType"];
                    personalTags.Public = (bool)reader["public"];

                    results.Add(personalTags);
                });
            return results;
        }
        public List<PersonalTag> GetTagsForTarget(int UserId, int TargetId, int targetType)
        {
            List<PersonalTag> results = new List<PersonalTag>();
            dataProvider.ExecuteCmd(
                "PersonalTags_GetTagsForTarget",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@userId", UserId);
                    parameters.AddWithValue("@targetId", TargetId);
                    parameters.AddWithValue("@targetType", targetType);
                },
                singleRecordMapper: (reader, resultsetnumber) =>
                {
                    PersonalTag personalTag = null;
                    personalTag = new PersonalTag();
                    personalTag.Id = (int)reader["Id"];
                    personalTag.DateCreated = (DateTime)reader["dateCreated"];
                    personalTag.UserId = (int)reader["userId"];
                    personalTag.TargetId = (int)reader["targetId"];
                    personalTag.Tag = (string)reader["tag"];
                    personalTag.TargetType = (int)reader["targetType"];
                    personalTag.Public = (bool)reader["public"];
                    results.Add(personalTag);
                });
            return results;
        }
        public PersonalTag GetByTag(int Tag)
        {
            PersonalTag personalTags = null;
            dataProvider.ExecuteCmd(
                "PersonalTags_GetTagsForTarget",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@Tag", Tag);
                },
                singleRecordMapper: (reader, resultsetnumber) =>
                {
                    personalTags = new PersonalTag();
                    personalTags.Id = (int)reader["Id"];
                    personalTags.DateCreated = (DateTime)reader["dateCreated"];
                    personalTags.UserId = (int)reader["userId"];
                    personalTags.TargetId = (int)reader["targetId"];
                    personalTags.Tag = (string)reader["tag"];
                    personalTags.TargetType = (int)reader["targetType"];
                    personalTags.Public = (bool)reader["public"];
                });
            return personalTags;
        }
        public int Create(SetTagsRequest req)
        {
            int newId = 0;
            dataProvider.ExecuteNonQuery(
                "PersonalTags_CreateUpdateDelete",
                inputParamMapper: (parameters) =>
                {
                    parameters.AddWithValue("@userId", req.UserId);
                    parameters.AddWithValue("@targetId", req.TargetId);
                    parameters.AddWithValue("@tags", JsonConvert.SerializeObject(req.Tags));
                    parameters.AddWithValue("@targetType", req.TargetType);
                }
            );
            return newId;
        }
        public void Update(SetTagsRequest req)
        {
            dataProvider.ExecuteNonQuery(
                "PersonalTags_CreateUpdateDelete",
                inputParamMapper: (parameters) =>
                {

                    parameters.AddWithValue("@userId", req.UserId);
                    parameters.AddWithValue("@targetId", req.TargetId);
                    parameters.AddWithValue("@tags", JsonConvert.SerializeObject(req.Tags));
                    parameters.AddWithValue("@targetType", req.TargetType);
                    
                });
        }
    }
}
