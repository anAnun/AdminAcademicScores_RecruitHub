using Sabio.Models.Requests;
using Sabio.Services;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IPersonalTagsService
    {
        List<PersonalTag> GetAllForUser(int userId);
        int Create(SetTagsRequest req);
        List<PersonalTag> GetTagsForTarget(int userId, int targetId, int targetType);
        void Update(SetTagsRequest req);
        
    }
}