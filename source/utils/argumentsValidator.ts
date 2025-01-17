import { string, object, array } from 'yup';
import { handleError } from '../utils';

const validateArgs = (args: any) => {
    console.log('En Validate');
    
    if (args.emailRecipients) {
        args.emailRecipients = args.emailRecipients.split(',').map((email: string) => email.trim());
    }

    const schema = object().shape({
        nameRegex: string().required(),
        appName: string().required(),
        emailSubject: string().required(),
        emailRecipients: array()
            .of(string().email())
            .required(),
    });

    schema.validate(args).catch((err: any) => {
        console.log('En Validate ERROR');
        handleError(err);
    });
};

export default validateArgs;
