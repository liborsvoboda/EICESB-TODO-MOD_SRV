using EasyGitServer.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace EasyGitServer.Interfaces {

    public interface IGitDbRepository<T> where T : BaseEntity {

        T GetById(int id);

        IEnumerable<T> List();

        IEnumerable<T> List(Expression<Func<T, bool>> predicate);

        void Add(T entity);

        void Delete(T entity);

        void Edit(T entity);
    }
}