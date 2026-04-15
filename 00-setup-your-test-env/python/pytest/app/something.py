from typing import Protocol


class RespondsToAMessage(Protocol):
    # A protocol is closest to an interface that Python has to offer.
    # It basically says,

    # This Protocol now offers one public message, which is the one below.
    def responds_to_a_message(self, number: int) -> str:
        """implement"""


# And this class implements to 'interface'
class ConcreteClassThatResponds(RespondsToAMessage):
    def responds_to_a_message(self, number: int) -> str:
        return f"{number}"

# This is a global method that uses the interface - similar to 'method injection'
def global_method_to_access_service(service: RespondsToAMessage, number: int) -> str:
    return service.responds_to_a_message(number)
