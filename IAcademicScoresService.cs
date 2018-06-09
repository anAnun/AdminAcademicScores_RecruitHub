using System.Collections.Generic;
using Sabio.Models.Domain;

namespace Sabio.Services.Interfaces
{
    public interface IAcademicScoresService
    {
        List<AcademicScores> GetAll();
        int Create(AcademicScoresCreateRequest req);
        AcademicScores GetById(int id);
        void Update(AcademicScoresUpdateRequest req);
        void Delete(int id);
    }
}