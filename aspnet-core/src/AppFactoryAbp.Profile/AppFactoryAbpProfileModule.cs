using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using AppFactoryAbp.Authorization;

namespace AppFactoryAbp
{
    [DependsOn(
        typeof(AppFactoryAbpCoreModule),
        typeof(AbpAutoMapperModule))]
    public class AppFactoryAbpProfileModule : AbpModule
    {
        public override void Initialize()
        {
            var thisAssembly = typeof(AppFactoryAbpProfileModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddProfiles(thisAssembly)
            );
        }
    }
}
