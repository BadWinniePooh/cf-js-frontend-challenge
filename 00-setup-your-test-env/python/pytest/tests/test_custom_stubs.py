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


from typing import Any, Callable
import pytest

@pytest.fixture
def raises() -> Any:
    def inner(msg):
        raise AssertionError(msg)
    return lambda msg: inner(msg)

@pytest.fixture()
def mock_with() -> Callable[[dict], Any]:
    def inner(klass):
        return lambda cb: type(klass, (), cb)

    return lambda klass: inner(klass)


@pytest.fixture
def responds_with_defaults(mock_with):
    default_cb = {"responds_to_a_message": lambda _: "42" }

    def overrides_defaults(cb: dict = {}) -> RespondsToAMessage:
        shape = {**default_cb, **cb}
        return mock_with('RespondsToAMessage')(shape)

    return overrides_defaults


def test_with_a_custom_message(mock_with, raises):
    responds_to_a_msg = mock_with("RespondsToAMessage")({
        "responds_to_a_message": lambda _: "foobar",
        "this_should_never_be_called": lambda _: raises("Shold not be called")
    })

    result = global_method_to_access_service(responds_to_a_msg, 0)
    assert result == "foobar"

def test_with_overridable(responds_with_defaults):
    responds_to_a_msg = responds_with_defaults()
    result = global_method_to_access_service(responds_to_a_msg, 0)
    assert result == "42"

    # can override defaults:
    responds_to_a_msg = responds_with_defaults({
        "responds_to_a_message": lambda _: "24"
    })
    result = global_method_to_access_service(responds_to_a_msg, 0)
    assert result == "24"
