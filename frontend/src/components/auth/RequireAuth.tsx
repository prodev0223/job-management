import { useLocation, Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentAccessToken, selectCurrentUser } from '../../redux/slices/authSlice';

const RequireAuth = ({ role }: { role: string[] }) => {
    const token = useSelector(selectCurrentAccessToken);
    const user = useSelector(selectCurrentUser);
    const location = useLocation();



    console.log('location', location)

    return (
        role.includes(user?.roleId?.name)
            ? <Outlet />
            : user
                ? <Navigate to="/kiosk" state={{ from: location }} replace />
                : location.pathname.includes('kiosk')
                    ? <Navigate to="/kiosk/login" state={{ from: location }} replace />
                    : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default RequireAuth