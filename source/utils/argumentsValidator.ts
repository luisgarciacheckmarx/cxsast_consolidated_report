import { string, object, array } from 'yup';
import { handleError } from '../utils';

const validateArgs = (args: any) => {
    if (args.recievers) {
        args.recievers = args.recievers.split(',').map((email: string) => email.trim());
    }

    const schema = object().shape({
        projectPattern: string().required(),
        appName: string().required(),
        emailSubject: string().required(),
        recievers: array()
            .of(string().email())
            .required(),
    });

    schema.validate(args).catch((err: any) => {
        handleError(err);
    });
};

export default validateArgs;
