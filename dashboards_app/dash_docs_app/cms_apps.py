from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _

@apphook_pool.register  # register the application
class DashDocsApphook(CMSApp):
    app_name = "dashdocs"
    name = _("Dashboard Documentations")

    def get_urls(self, page=None, language=None, **kwargs):
        return ["dash_docs_app.urls"]
