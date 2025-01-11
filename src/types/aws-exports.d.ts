declare module '*/aws-exports' {
    interface AwsConfig {
        aws_project_region: string;
        aws_cognito_region: string;
        aws_user_pools_id?: string;
        aws_user_pools_web_client_id?: string;
        oauth?: object;
        aws_appsync_graphqlEndpoint?: string;
        aws_appsync_region?: string;
        aws_appsync_authenticationType?: string;
    }
    
    const config: AwsConfig;
    export default config;
}