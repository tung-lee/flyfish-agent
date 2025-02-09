import { getFolderByUserAddress, getDataFromVault } from './getFolderData'

async function main() {
    try {
        // Lấy data theo địa chỉ ví
        const data = await getFolderByUserAddress("0xetstssss");
        if (data != "TUS_API or TUSKY_API_KEY is not set")
            if (typeof data != "string") {
            const vc = data.map((item: any) => item.data);
            console.log("vc", vc);
        }

        // Hoặc lấy tất cả data từ vault
        const vaultId = process.env.defaultvault
        const vaultData = await getDataFromVault(vaultId)
        console.log("Vault Data:", vaultData)
    } catch (error) {
        console.error("Error:", error)
    }
}

main()