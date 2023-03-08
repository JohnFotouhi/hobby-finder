import { setAuthCookies, useAuthUser } from 'next-firebase-auth';
import initAuth from '../../initAuth';

initAuth();

export default async function handler(req, res){
    try{
        await setAuthCookies(req, res);
    } catch(e){
        return res.status(500).json({error: e})
    }
    return res.status(200).json({ success: true })
}