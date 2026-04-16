from app.something import global_method_to_access_service, ConcreteClassThatResponds, RespondsToAMessage
from pytest_mock import MockerFixture


#   TestDouble concept and few useful references for pytest-mock package
#   - https://martinfowler.com/bliki/TestDouble.html
#   - https://changhsinlee.com/pytest-mock/
#   - https://myadventuresincoding.wordpress.com/2011/02/26/python-python-mock-cheat-sheet/

#
#   Example of using stubs
#   1. Hand written class - ServiceStub
#   2. using pytest-mock patch facilities
#

class StaticClassThatImplementProtocols(RespondsToAMessage):
    # This always returns same value, so can be implemented easily with at staticmethod

    @staticmethod
    def responds_to_a_message(number):
        return "42"


class InstantiableClassThatImplementsProtocol(RespondsToAMessage):
    # This is not a static method, so one needs to instantiate at class in test

    def __init__(self, number):
        self._number = number
    def responds_to_a_message(self, number):
        return str(self._number) + "-" + str(number)

def test_fakeable_classes():
    result = global_method_to_access_service(StaticClassThatImplementProtocols(), 0)
    assert result == "42"

    # Create an instance of TestableClass
    the_shape = InstantiableClassThatImplementsProtocol(23)
    result = global_method_to_access_service(the_shape, 5)
    assert result == "23-5"

