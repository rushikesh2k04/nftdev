from algopy import ARC4Contract, GlobalState, BoxMap, Txn, UInt64, Bytes, arc4
from algopy.arc4 import abimethod, Address, String, Bool, Struct, DynamicArray

class MedicalRecord(Struct):
    owner: Address
    ipfs_url: String
    creation_date: UInt64
    verified: Bool
    access_list: DynamicArray[Address]

class MedicalNFTContract(ARC4Contract):
    def __init__(self) -> None:
        self.total_records = GlobalState(UInt64(0), key="totalRecords")
        self.medical_records = BoxMap(UInt64, MedicalRecord)
        self.record_index = BoxMap(Address, DynamicArray[UInt64])

    @abimethod
    def mint_record(self, ipfs_url: String) -> UInt64:
        # Validate IPFS URL format
        assert ipfs_url.startswith("ipfs://"), "Invalid IPFS URL format"

        # Create new record
        record_id = self.total_records.value
        new_record = MedicalRecord(
            owner=Txn.sender,
            ipfs_url=ipfs_url,
            creation_date=Global.latest_timestamp,
            verified=Bool(False),
            access_list=DynamicArray[Address]([Txn.sender])
        )

        # Store record
        self.medical_records[record_id] = new_record

        # Update indexes
        self.total_records.value += UInt64(1)
        if self.record_index.contains(Txn.sender):
            self.record_index[Txn.sender].append(record_id)
        else:
            self.record_index[Txn.sender] = DynamicArray[UInt64]([record_id])

        # Create NFT (ASA)
        return self._create_asa(ipfs_url)

    @abimethod
    def grant_access(self, record_id: UInt64, doctor: Address) -> None:
        assert self.medical_records.contains(record_id), "Record not found"
        record = self.medical_records[record_id]

        assert record.owner == Txn.sender, "Only owner can grant access"
        record.access_list.append(doctor)
        self.medical_records[record_id] = record

    @abimethod
    def get_record(self, record_id: UInt64) -> MedicalRecord:
        assert self.medical_records.contains(record_id), "Record not found"
        record = self.medical_records[record_id]

        assert (
            Txn.sender in record.access_list or
            Txn.sender == record.owner
        ), "Unauthorized access"

        return record

    def _create_asa(self, ipfs_url: String) -> UInt64:
        # Create NFT using inner transaction
        return op.ITxnCreateAsset(
            total=1,
            decimals=0,
            asset_name=Bytes("MEDREC"),
            unit_name=Bytes("MREC"),
            url=ipfs_url.bytes,
            manager=Txn.sender,
            reserve=Txn.sender,
            clawback=Txn.sender,
            freeze=Global.zero_address,
            default_frozen=False
        ).submit().created_asset_id
