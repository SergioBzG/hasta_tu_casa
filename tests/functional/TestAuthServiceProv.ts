import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

export async function getTokenAuthServiceProv(): Promise<string> {
    let endpoint = "/api/hastaTuCasa/loginByEmail"
    let body ={
        email: "hele@unal.edu.co",
        password: "hele" 
    }
    let axiosResponse = await axios.post(`${Env.get("PATH_APP") + endpoint}`, body)
    return axiosResponse.data["token"]
}