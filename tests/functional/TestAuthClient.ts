import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

export async function getTokenAuthClient(): Promise<string> {
    let endpoint = "/api/hastaTuCasa/loginByEmail"
    let body ={
        email: "ama@unal.edu.co",
        password: "ama" 
    }
    let axiosResponse = await axios.post(`${Env.get("PATH_APP") + endpoint}`, body)
    return axiosResponse.data["token"]
}