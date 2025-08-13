using System;
using System.Collections.Generic;

namespace EasyGitServer.Models
{
    public class TeamRepositoryRole
    {
        public long TeamID { get; set; }
        public long RepositoryID { get; set; }
        public bool AllowRead { get; set; }
        public bool AllowWrite { get; set; }
        public virtual GitDbRepository Repository { get; set; }
        public virtual Team Team { get; set; }
    }
}
