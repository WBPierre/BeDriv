import requests

from src.config.blockchain.blockchain_url import BLOCKCHAIN_URL
from src.looking_for_drive.core.bridge.incoming.blockchain import BlockChain


class LocalBlockChain(BlockChain):

    def get_cashback(self,
                     public_key: str,
                     amount: float):
        requests.post(F'{BLOCKCHAIN_URL}/transfer',
                      json=dict(public_key=public_key,
                                amount=amount))
