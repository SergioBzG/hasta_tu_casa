import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

export async function getTokenAuthAdmin(): Promise<string> {
    let endpoint = "/api/hastaTuCasa/loginByEmail"
    let body ={
        email: "cass@unal.edu.co",
        password: "cass" 
    }
    let axiosResponse = await axios.post(`${Env.get("PATH_APP") + endpoint}`, body)
    return axiosResponse.data["token"]
}