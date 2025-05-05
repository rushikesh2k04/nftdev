import logging
import algokit_utils

logger = logging.getLogger(__name__)

def deploy() -> None:
    from smart_contracts.artifacts.medical_nft.medical_nft_client import (
        MedicalNFTContractFactory,
    )

    # Initialize Algorand client from environment (see .env or environment variables)
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")

    # Load the factory for your contract
    factory = algorand.client.get_typed_app_factory(
        MedicalNFTContractFactory, default_sender=deployer.address
    )

    # Deploy or update the contract
    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    # Fund the contract with 1 ALGO for minimum balance and box storage
    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=1),
                sender=deployer.address,
                receiver=app_client.app_address,
            )
        )
        logger.info(
            f"Funded {app_client.app_name} ({app_client.app_id}) with 1 ALGO"
        )

    # Example: Call mint_record with a test IPFS URL (you should replace this in production)
    ipfs_url = "ipfs://your-test-cid"
    response = app_client.send.mint_record(ipfs_url=ipfs_url)
    logger.info(
        f"Called mint_record on {app_client.app_name} ({app_client.app_id}) "
        f"with ipfs_url={ipfs_url}, received: {response.abi_return}"
    )

if __name__ == "__main__":
    deploy()
