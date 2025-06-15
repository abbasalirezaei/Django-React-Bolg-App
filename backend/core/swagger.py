# your_app/swagger.py

from drf_yasg.inspectors import SwaggerAutoSchema

class TaggedAutoSchema(SwaggerAutoSchema):
    def get_tags(self, operation_keys=None):
        if hasattr(self.view, 'swagger_tags'):
            return self.view.swagger_tags
        return super().get_tags(operation_keys)
