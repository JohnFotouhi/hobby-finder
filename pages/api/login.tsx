import { setAuthCookies } from 'next-firebase-auth';
import initAuth from '../../initAuth';

initAuth();

export default async function Handler(req, res){
    try{
        await setAuthCookies(req, res)
    } catch(e){
        return res.status(500).json({error: 'Unexpected error.'})
    }
    return res.status(200).json({ success: true })
}