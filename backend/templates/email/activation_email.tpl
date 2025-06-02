{% extends "mail_templated/base.tpl" %}

{% block subject %}
Activation
{% endblock %}

{% block html %}
http://localhost:8000/accounts/api/v1/activation/confirm/{{token}}
{% endblock %}