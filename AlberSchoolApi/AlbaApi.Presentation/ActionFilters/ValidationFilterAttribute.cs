using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AlbaApi.Presentation.ActionFilters;

public class ValidationFilterAttribute : IActionFilter
{
    public ValidationFilterAttribute() { }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var action = context.RouteData.Values["action"];
        var controller = context.RouteData.Values["controller"];
        var param = context.ActionArguments
              .Values
              .FirstOrDefault(v => v != null && (v.GetType().Name.EndsWith("Dto") || v.GetType().Name.EndsWith("Request")));
        if (param is null)
        {
            context.Result =
                new BadRequestObjectResult($"Object is null. Controller:{ controller }, action: { action}");
            return;
        }
        if (!context.ModelState.IsValid)
            context.Result = new UnprocessableEntityObjectResult(context.ModelState);
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
