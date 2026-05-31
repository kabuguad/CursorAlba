using System.Reflection;

namespace AlbaApi.Presentation;

public static class AssemblyReference
{
    public static Assembly Assembly
    {
        get
        {
            var type = typeof(AssemblyReference);
            return type.Assembly;
        }
    }
}
