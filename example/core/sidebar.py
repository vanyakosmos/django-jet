from jet import sidebar


class Sidebar(sidebar.Sidebar):
    def init_with_context(self, context):
        self.sections = [
            sidebar.AppsSection(),
        ]
