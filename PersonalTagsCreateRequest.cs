using System;

namespace Sabio.Services
{
    public class PersonalTagsCreateRequest
    {
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public int UserId { get; set; }
        public int TargetId { get; set; }
        public string Tag { get; set; }
        public int TargetType { get; set; }
        public bool Public { get; set; }
    }
}