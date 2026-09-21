using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

namespace RigForge.GCommon.ModelBinding;

public class EnumBindingMessageProvider : IBindingMetadataProvider
{
    public void CreateBindingMetadata(BindingMetadataProviderContext context)
    {
        EnumDataTypeAttribute? attribute = context.Attributes
            .OfType<EnumDataTypeAttribute>()
            .FirstOrDefault();

        if (attribute?.ErrorMessage == null
            || context.BindingMetadata.ModelBindingMessageProvider is not DefaultModelBindingMessageProvider current)
        {
            return;
        }

        string message = attribute.ErrorMessage;

        DefaultModelBindingMessageProvider messages = new DefaultModelBindingMessageProvider(current);

        messages.SetValueIsInvalidAccessor(_ => message);
        messages.SetAttemptedValueIsInvalidAccessor((_, _) => message);

        context.BindingMetadata.ModelBindingMessageProvider = messages;
    }
}
