from jet.dashboard import modules
from jet.dashboard.dashboard import DefaultAppIndexDashboard


class EventsStatsModule(modules.DashboardModule):
    title = "Module"
    template = 'core/module.html'


class CustomAppIndexDashboard(DefaultAppIndexDashboard):
    columns = 3

    def init_with_context(self, context):
        super().init_with_context(context)
        for mod in modules.LinkList, modules.ModelList, modules.RecentActions:
            self.available_children.append(mod)

        self.available_children.append(EventsStatsModule)
        self.children[1].column = 2
        self.children.append(
            EventsStatsModule(column=1, order=0)
        )
