from src.looking_for_drive.core.bridge.incoming.blockchain import BlockChain


class MockBlockChain(BlockChain):

    def get_cashback(self,
                     public_key: str,
                     amount: float):
        return amount
