using System;

namespace Sabio.Services.Interfaces
{
    public interface IAcademicScoresUpdateRequest
    {
        int ACT { get; set; }
        DateTime DateModified { get; set; }
        decimal GPA { get; set; }
        int SAT { get; set; }
    }
}