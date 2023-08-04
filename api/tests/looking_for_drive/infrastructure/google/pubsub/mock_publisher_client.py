class MockPublisherClient:

    def __init__(self):
        self.topics = dict()

    def topic_path(self,
                   project_id: str,
                   topic_id: str):
        return topic_id

    def publish(self,
                topic_path: str,
                data):
        if self.topics.get(topic_path):
            self.topics[topic_path].append(data)
        else:
            self.topics[topic_path] = [data]
