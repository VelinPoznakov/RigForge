import {useParams} from "react-router";
import useFetchData from "../ utils/request.js";
import BuildForm from "./BuildForm.jsx";

export default function EditBuild(){
    const {id} = useParams();

    const {data: build, loading: isLoading, errors} = useFetchData(null, `/api/builds/${id}`);

    return(
        <BuildForm key={build?.id ?? 'loading'}
                   build={build}
                   isLoading={isLoading}
                   loadErrors={errors} />
    );
}
