using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Constraints;

namespace EasyGitServer
{
	public static class RouteConfig
    {
		public static void RegisterRoutes(IRouteBuilder routeBuilder)
		{
			routeBuilder.MapRoute(
                "Github/Home",
                "github/{controller=Home}/{action=Home}/{id?}"
            );

			#region Routes for viewing the file tree
			routeBuilder.MapRoute(
				"RedirectGitLink",
                "github/{userName}/{repoName}.git",
				new { controller = "FileView", action = "RedirectGitLink" },
				new { method = new HttpMethodRouteConstraint("GET") }
			);

			routeBuilder.MapRoute(
                "GetRepositoryHomeView",
                "github/{userName}/{repoName}",
				new { controller = "FileView", action = "GetTreeView", id = "master", path = string.Empty },
				new { method = new HttpMethodRouteConstraint("GET") }
			);

			routeBuilder.MapRoute(
                "GetTreeView",
                "github/{userName}/{repoName}/tree/{id}/{*path}",
				new { controller = "FileView", action = "GetTreeView" },
				new { method = new HttpMethodRouteConstraint("GET") }
			);

			routeBuilder.MapRoute(
                "GetBlobView",
                "github/{userName}/{repoName}/blob/{id}/{*path}",
				new { controller = "FileView", action = "GetBlobView" },
				new { method = new HttpMethodRouteConstraint("GET") }
			);

			routeBuilder.MapRoute(
                "GetRawBlob",
                "github/{userName}/{repoName}/raw/{id}/{*path}",
				new { controller = "FileView", action = "GetRawBlob" },
				new { method = new HttpMethodRouteConstraint("GET") }
			);

            #endregion
        }
    }
}
