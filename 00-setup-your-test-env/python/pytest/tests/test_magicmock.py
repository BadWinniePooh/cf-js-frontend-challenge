from app.something import global_method_to_access_service, ConcreteClassThatResponds, RespondsToAMessage
from unittest.mock import MagicMock

#   TestDouble concept and few useful references for pytest-mock package
#   - https://martinfowler.com/bliki/TestDouble.html
#   - https://changhsinlee.com/pytest-mock/
#   - https://myadventuresincoding.wordpress.com/2011/02/26/python-python-mock-cheat-sheet/

def test_fakeable_classes():

    mock = MagicMock()
    mock.responds_to_a_message.return_value = "42"
    result = global_method_to_access_service(mock, 0)
    assert result == "42"


