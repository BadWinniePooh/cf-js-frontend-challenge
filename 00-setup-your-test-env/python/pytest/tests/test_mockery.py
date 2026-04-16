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


def test_stub_using_pytest(mocker):
    expected = 'foo'

    def method_stub(self, some_number):
        return 'foo'

    mocker.patch(
        'app.something.ConcreteClassThatResponds.responds_to_a_message',
        method_stub
    )

    actual = ConcreteClassThatResponds().responds_to_a_message(expected)
    assert expected == actual


#
#   Example of using mock:
#   NOTE:
#       We can move patching into function's decorators
#       but we still need to pass reference of mocker framework into
#       method to use mock package functionality
#


def test_mock_a_method_of_a_class(mocker: MockerFixture) -> None:
    mocker.patch('app.something.ConcreteClassThatResponds.responds_to_a_message')
    rpc = ConcreteClassThatResponds()
    rpc.responds_to_a_message(-135)
    ConcreteClassThatResponds.responds_to_a_message.assert_called_with(-135)


def test_mock_a_method_of_a_class_2(mocker: MockerFixture) -> None:
    mocker.patch('app.something.ConcreteClassThatResponds.responds_to_a_message')
    rpc = ConcreteClassThatResponds()
    global_method_to_access_service(rpc, 100500)
    ConcreteClassThatResponds.responds_to_a_message.assert_called_once_with(100500)


def test_mock_method_of_an_object(mocker: MockerFixture) -> None:
    expected = 'foo'
    rpc = ConcreteClassThatResponds()

    mocker.patch.object(
        rpc,
        'responds_to_a_message',
        return_value=expected,
        autospec=True)

    assert global_method_to_access_service(rpc, expected) == expected
